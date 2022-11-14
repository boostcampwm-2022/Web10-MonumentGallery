# python 서버 실행방법

### python 경로로 이동

`cd python`

### python 가상환경 생성

`python -m venv .venv`

### python 인터프리터 선택

- window
  `.venv\Scripts\activate.bat`
- mac
  `source .venv/bin/activate`

### dependency 설치

`pip install -r requirements.txt`

### FastAPI 서버 실행

`uvicorn main:app --reload`
