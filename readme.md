![logo](https://user-images.githubusercontent.com/68687144/207802799-8133d3e2-8d97-4521-b434-183302a218d0.png)

## 🎆프로젝트 소개

<img width="1280" alt="monument gallery" src="https://user-images.githubusercontent.com/32293736/205430959-b6713512-819c-4075-a103-c720b7629285.png">

<br />

**데모** : https://monumentgallery.ddns.net/

**저희의 고민들** : [Monument Gallery Notion](https://boostcamp7-monolith.notion.site/Monument-Gallery-7d1239b321684fed94d4669bcee673f0)

**시연영상** : [시연영상 보러가기](https://www.youtube.com/watch?v=0VZyVAeBpco)

**발표영상** : [발표영상 보러가기](https://www.youtube.com/watch?v=w01j1Fw2EUY)

### 🪦 **당신의 기록을 예술로 만들어드립니다!**

노션 API를 이용해 사용자의 노션 글, 그림 데이터들을 받아오고 3D 공간 안에서 시각화 해주는 프로젝트입니다.

- Notion OAuth 진행 후 시각화할 페이지를 선택하고 기록물(**갤러리**)로 만들 수 있습니다.
  - 갤러리 내부에서는 1인칭 시점 조작으로 결과물을 플레이어 움직임을 통해 경험합니다.
  - 갤러리는 유저 히스토리로서 관리되며 하나의 유저 당 여러 히스토리가 존재하게 됩니다.
- 메인 로비에서는 다른 유저들의 갤러리를 탐방할 수 있습니다.
  - 유저의 갤러리들이 하나의 형태(**모뉴먼트**)로 존재합니다.
  - 3인칭 시점 조작으로 나의 캐릭터를 움직여 해당 유저의 갤러리로 이동합니다.

자주묻는 질문 : [프로젝트 상세 소개](https://www.notion.so/boostcamp7-monolith/aec3c6f5e42f4d088026037d439cc6f6)

## 👨‍👨‍👦‍👦팀 소개

| 🧑‍🚀[J215 한기종](https://github.com/lybell-art)           | 🥷[J010 고세연](https://github.com/koseyeon)           | 🙉[J154 이정욱](https://github.com/junguk98)               | 🕵️[J155 이종찬](https://github.com/Lipeya)               |
| -------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------- |
| <img src="https://github.com/lybell-art.png" width=100/> | <img src="https://github.com/koseyeon.png" width=100/> | <img src="https://github.com/junguk98.png" width="100px"/> | <img src="https://github.com/Lipeya.png" width="100px"/> |
| 팀의 휴식담당                                            | 팀의 맏형담당                                          | 팀의 꼬마담당                                             | 팀의 낮잠담당                                            |
| 민트초코 좋아함                                          | 아자아자파이팅                                         | 난집게리아가아냐                                          | 기계는부숴야제맛                                         |

## 🪄주요 기능

### 🎨Notion 데이터 시각화

- Notion OAuth를 이용한 구조적 데이터 불러오기
- 키워드 자연어 처리 및 통계 추출
- 키워드 기반 페이지 분류 및 맵 생성
- 이미지 처리 및 픽셀 추출

### 🖼️갤러리

![gallery](https://user-images.githubusercontent.com/68687144/207827402-6cac009f-d0bd-42be-bfe3-71b6d799e7a8.png)

- 1인칭 플레이어 이동, E키로 모드 전환 및 레이캐스터 변경
- 3D 워드클라우드
- 링크 반석 상호작용
- 사진 파편 인터랙션
- 갤러리 공유 기능
- 갤러리 히스토리 변경 기능
- 갤러리 동기화 기능

### 🏛️메인 로비

![main](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/98790b62-2292-4edc-9941-0633e037e1af/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221215T094008Z&X-Amz-Expires=86400&X-Amz-Signature=df2ccb49a48a951ef909aed785471d70786dd07ce9a66d19addf14609cc8cbfb&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

- 3인칭 플레이어 이동
- 모뉴먼트에 가까이 갈 시 페이지 이동
- 페이지네이션 인터랙션
  - 플레이어가 모뉴먼트가 없는 쪽으로 이동하면 동적으로 페이지를 불러와서 배치하는 알고리즘

## ⚙️기술 스택 & 아키텍쳐

![https://user-images.githubusercontent.com/46295027/202600579-06b04e00-84d6-4024-bb1d-8031dbca1808.png](https://user-images.githubusercontent.com/46295027/202600579-06b04e00-84d6-4024-bb1d-8031dbca1808.png)

### FE

- TypeScript
- React
- React Three Fiber
- Zustand
- Sass
- Vite

### BE

- Express
- MongoDB
- Redis
- FastAPI
- Nginx

### CI/CD

- Github Actions
- Docker
