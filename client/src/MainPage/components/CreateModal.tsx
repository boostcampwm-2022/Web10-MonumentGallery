import userStore from "../../store/user.store";
import "./CreateModal.scss";
import NotionIcon from "../../assets/images/notion-icon.png";

function MyGalleryLinkPartion() {
  const { user } = userStore();
  function moveMyGallery() {
    window.location.href = `/gallery/${user.id}`;
  }

  return (
    <div className="create-modal-part">
      <span className="create-modal-title">내 갤러리로 이동</span>
      <button type="button" onClick={moveMyGallery}>
        <span>이동</span>
      </button>
    </div>
  );
}

function NewGalleryPartion() {
  const { isLoggedIn } = userStore();
  function notionOauthHandler() {
    window.location.href = "/auth/login";
  }

  return (
    <div className="create-modal-part">
      <span className="create-modal-title">갤러리 만들기</span>
      <button type="button" onClick={notionOauthHandler}>
        <img width={25} height={25} src={NotionIcon} />
        {isLoggedIn ? <span>페이지 가져오기</span> : <span>Notion Login</span>}
      </button>
    </div>
  );
}

export default function CreateModal() {
  const { isLoggedIn, isCreated } = userStore();

  return (
    <div className="create-modal">
      {isLoggedIn && isCreated && <MyGalleryLinkPartion />}
      <NewGalleryPartion />
    </div>
  );
}
