export default function GalleryHelp() {
  return (
    <>
      <div className="sign-html-intro">
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
          height="413px"
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
          height="386px"
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
    </>
  );
}
