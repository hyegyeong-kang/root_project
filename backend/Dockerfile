# Python 3.9 이미지 사용
FROM python:3.9

# 작업 디렉토리 생성
WORKDIR /app

# requirements.txt 복사 및 패키지 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 실제 앱 코드 복사 (app 폴더 전체)
COPY app ./app

# 작업 디렉토리 변경 (app.py가 있는 폴더)
WORKDIR /app/app

# 앱 실행
CMD ["python", "app.py"]
