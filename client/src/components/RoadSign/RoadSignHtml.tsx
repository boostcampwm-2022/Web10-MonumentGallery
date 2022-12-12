import { useState } from "react";

export function RoadSignMainPageHtml() {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <>
      <div className="sign-html-intro" hidden={showIframe}>
        <h1>Monument Gallery 사용법 - 메인</h1>
        <br />
        <h3>
          🪦 현재 페이지는 <b>메인 페이지</b>에요.
        </h3>
        <div>
          - <b>WASD</b>로 <b>유령 캐릭터</b>를 움직일 수 있어요.
        </div>
        <div>
          - 맵 위에 있는 <b>모뉴먼트</b>는 다른 유저의 <b>기록물들</b>이에요. 모뉴먼트에 가까이 이동하여 인터렉션
          해보세요!
        </div>
        <div>
          - 모뉴먼트에 가까이 이동 후 <b>space</b>를 입력하면 해당 유저의 개인 공간으로 이동할 수 있어요.
        </div>
        <br />
        <h3>
          🪦 노션 로그인을 진행하기 어렵다면,
          <a href="/gallery">
            <b> 샘플 월드</b>
          </a>
          로 이동해서 체험해보세요!
        </h3>
        <br />
        <h3>
          🪦 하단의 &quot;<span className="mapo-flower-span">Upload</span>&quot; 버튼을 클릭하여 노션 로그인을 진행한
          뒤, 페이지를 선택하세요.
        </h3>
        <div>- 페이지를 선택했다면 갤러리 생성 페이지로 이동해요.</div>
        <div>- 갤러리 생성 페이지에서는 여러분의 노션 데이터를 토대로 멋진 공간을 만들어드려요</div>
        <div>- 갤러리 생성 페이지에서는 샘플 월드를 미리 체험할 수 있도록 준비해두었답니다.</div>
        <div>- 서버 작업이 오래걸릴 수 있으므로 기본 기능을 미리 알아볼 수 있어요.</div>
        <h3>🪦 이 외에도 여러가지 기능을 발견해보세요!</h3>
      </div>
      <button className="sign-html-notion-button" onClick={() => setShowIframe((state) => !state)}>
        {showIframe ? "돌아가기" : "팀 노션 보기"}
      </button>
      <iframe
        className="sign-html-iframe"
        hidden={!showIframe}
        loading="eager"
        src="https://notioniframe.com/notion/12fqbg8hjtj"
      ></iframe>
    </>
  );
}

export function RoadSignGalleryPageHtml() {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <>
      <div className="sign-html-intro" hidden={showIframe}>
        <h1>Monument Gallery 사용법 - 갤러리</h1>
        <br />
        <h3>
          🪦 현재 페이지는 <b>갤러리 페이지</b>에요.
        </h3>
        <div>
          - <b>WASD</b>로 <b>캐릭터</b>를 움직일 수 있어요.
        </div>
        <div>
          - <b>Space</b>로 캐릭터를 위로, <b>Left Shift</b>로 캐릭터를 아래로 움직일 수 있어요.
        </div>

        <br />
        <img
          width="600px"
          src="https://kr.object.ncloudstorage.com/monument-gallery/image/guide-gallery.png"
          alt="guide-gallery"
        />
        <br />

        <br />
        <div>
          <h3>1. 상단 바</h3>
          - 상단 바에서는 메인 페이지도 돌아가거나 현재 갤러리 정보, 사용자 정보를 확인할 수 있으며
          <br />
          테마를 변경하거나 히스토리를 조회할 수 있어요.
        </div>
        <br />
        <img
          width="600px"
          src=" https://kr.object.ncloudstorage.com/monument-gallery/image/guide-history.png"
          alt="guide-history"
        />
        <br />
        <div> - 히스토리 버튼을 클릭하여 히스토리를 조회하고 불러올 수 있어요.</div>

        <br />
        <div>
          <h3>2. 메인 화면</h3>
          - E키를 토글하여 마우스로 화면을 전환하거나 취소할 수 있어요. <br />- 오브젝트를 클릭하거나 다가가서 상호작용
          할 수 있어요. (ex. 이미지 파편을 클릭!)
        </div>

        <br />
        <div>
          <h3>3. 동기화, 공유 버튼</h3>- 동기화 버튼을 클릭하여 새로운 히스토리를 생성해 보세요. <br />- 공유 버튼을
          통해 다른 사용자들과 갤러리를 공유하세요.
        </div>

        <br />
        <div>
          <h3>4. 하단 바</h3>
          - 배경음악을 재생/중지하거나 음량을 조절할 수 있어요.
          <br />- 스크린샷을 찍거나 전체화면(<b>F</b>)으로 전환합니다.
        </div>
      </div>
      <button className="sign-html-notion-button" onClick={() => setShowIframe((state) => !state)}>
        {showIframe ? "돌아가기" : "팀 노션 보기"}
      </button>
      <iframe
        className="sign-html-iframe"
        hidden={!showIframe}
        loading="eager"
        src="https://notioniframe.com/notion/12fqbg8hjtj"
      ></iframe>
    </>
  );
}
