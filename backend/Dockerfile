# Python 기반 이미지 사용
FROM python:3.9

# 작업 디렉토리 생성
WORKDIR /app/app

# 코드 복사
COPY . /app

# 의존성 설치
RUN pip install --no-cache-dir -r /app/requirements.txt

# 앱 실행
CMD ["python", "app.py"]
