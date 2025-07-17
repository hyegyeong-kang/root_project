from fastapi import FastAPI, HTTPException, Request
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Instrumentator 등록
Instrumentator().instrument(app).expose(app)

@app.post("/chat")
async def chatbot_handler(request: Request):
    # 여기에 챗봇 로직
    return {"response": "안녕하세요!"}



sample_data = [
    {
        "id": "restaurant001",
        "name": "맛있는 한식당",
        "image_url": "https://example.com/images/restaurant001.jpg",
        "phone": "02-1234-5678",
        "address": "서울시 마포구 월드컵북로 123",
        "region": "마포구",
        "hours": "10:00 - 22:00",
        "signature_menu": "불고기",
        "category": "한식",
        "menu": [
            {"name": "불고기", "price": 15000},
            {"name": "비빔밥", "price": 8000},
            {"name": "된장찌개", "price": 7000}
        ],
        "rating": 4.5,
        "parking": True,
        "group_available": True,
        "reviews": [
            {
                "user": "김철수",
                "rating": 5,
                "comment": "정말 맛있고 친절해요!",
                "images": [
                    "https://example.com/review_images/review001_1.jpg",
                    "https://example.com/review_images/review001_2.jpg"
                ]
            }
        ]
    }
]



# ✅ 음식점 응답 모델 (간단히 쓰는 용도)
class RestaurantSummary(BaseModel):
    id: str
    name: str
    category: str
    region: str
    rating: float

# ✅ 음식점 전체 목록 (필터 포함)
@app.get("/restaurants", response_model=List[RestaurantSummary])
def get_restaurants(category: Optional[str] = None):
    if category:
        filtered = [r for r in sample_data if r["category"] == category]
    else:
        filtered = sample_data
    return [
        {
            "id": r["id"],
            "name": r["name"],
            "category": r["category"],
            "region": r["region"],
            "rating": r["rating"]
        } for r in filtered
    ]

# ✅ 음식점 상세 정보
@app.get("/restaurants/{restaurant_id}")
def get_restaurant_detail(restaurant_id: str):
    for r in sample_data:
        if r["id"] == restaurant_id:
            return r
    raise HTTPException(status_code=404, detail="음식점을 찾을 수 없습니다")


# ✅ 리뷰 입력 모델
class Review(BaseModel):
    user: str
    rating: int
    comment: Optional[str] = None
    images: List[str] = []


# ✅ 특정 음식점의 리뷰만 조회
@app.get("/restaurants/{restaurant_id}/reviews", response_model=List[Review])
def get_reviews(restaurant_id: str):
    for r in sample_data:
        if r["id"] == restaurant_id:
            return r["reviews"]
    raise HTTPException(status_code=404, detail="음식점을 찾을 수 없습니다")