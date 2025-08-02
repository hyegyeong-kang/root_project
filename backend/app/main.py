from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os, json, pymongo, requests, boto3, re

# 환경변수 로드
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
KAKAO_API_KEY = os.getenv("KAKAO_API_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# AWS Bedrock client
bedrock_runtime = boto3.client("bedrock-runtime", region_name=AWS_REGION)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제로는 필요한 도메인만 허용할 것
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_kakao_place_url(name, phone_number):
    if not KAKAO_API_KEY or not name:
        return None

    query = f"{name} {phone_number}" if phone_number else name
    headers = {"Authorization": f"KakaoAK {KAKAO_API_KEY}"}
    url = "https://dapi.kakao.com/v2/local/search/keyword.json"
    params = {"query": query, "size": 1}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data['documents']:
            return data['documents'][0].get('place_url')
    except Exception as e:
        print(f"Kakao API Error: {e}")
    return None

def extract_entities_from_query(query):
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    prompt = f"""\n\nHuman: 다음 사용자 질문에서 지역과 음식 종류를 추출해서 JSON 형식으로 반환해줘. 각 키는 "location", "food_type"로 하고, 해당하는 정보가 없으면 null 값을 사용해.\n<query>{query}</query>\n\nAssistant:"""
    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31", "max_tokens": 200,
        "messages": [{"role": "user", "content": prompt}], "temperature": 0.1,
    })
    try:
        response = bedrock_runtime.invoke_model(body=body, modelId=model_id, accept="application/json", contentType="application/json")
        response_body = json.loads(response.get('body').read())
        json_string = response_body['content'][0]['text']
        match = re.search(r'\{.*\}', json_string, re.DOTALL)
        return json.loads(match.group()) if match else {"location": None, "food_type": None}
    except Exception as e:
        print(f"Bedrock API Error: {e}")
        return {"location": None, "food_type": None}

@app.post("/search")
async def search(request: Request):
    body = await request.json()
    user_query = body.get("query")
    if not user_query:
        return {"message": "검색어(query)가 필요합니다."}

    client = None
    try:
        client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client['root_db']
        collection = db['final']

        entities = extract_entities_from_query(user_query)
        location, food_type = entities.get("location"), entities.get("food_type")
        query_filter = {}
        if location: query_filter["crawled_주소"] = {"$regex": location, "$options": "i"}
        if food_type: query_filter["업태구분명"] = {"$regex": food_type, "$options": "i"}

        pipeline = [
            {"$match": query_filter},
            {"$group": {"_id": "$정제_사업장명", "doc": {"$first": "$$ROOT"}}},
            {"$replaceRoot": {"newRoot": "$doc"}},
            {"$limit": 5}
        ]

        results = []
        for doc in collection.aggregate(pipeline):
            place_url = get_kakao_place_url(doc.get("사업장명_원문"), doc.get("crawled_전화번호"))
            results.append({
                "가게이름": doc.get("정제_사업장명"),
                "업태": doc.get("업태구분명"),
                "주소": doc.get("crawled_주소"),
                "평점": doc.get("crawled_평점"),
                "가게이미지URL": doc.get("crawled_가게 이미지 URL"),
                "상세보기URL": place_url
            })

        return results if results else {"message": "조건에 맞는 가게를 찾을 수 없습니다."}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if client: client.close()
