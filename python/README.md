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

# konlpy 환경 주의사항

m1 mac의 경우 JDK 버전 문제로 인해 실행이 안될 수 있습니다.
jdk17 버전을 설치하시면 정상 작동하는 것을 확인하였습니다.(아래 링크 참고)
https://github.com/hexists/konlpy/wiki/konlpy-X-m1-silicon
