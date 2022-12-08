import { useState } from "react";

export default function RoadSignHtml() {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <>
      <div className="sign-html-intro" hidden={showIframe}>
        <h1>Monument Gallery 사용법</h1>
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
