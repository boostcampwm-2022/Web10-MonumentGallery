import React, { useState } from "react";
import FullScreenModal from "../components/modal/FullScreenModal";
import "./style.scss";

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);
  function notionOauthHandler() {
    window.location.href =
      "https://api.notion.com/v1/oauth/authorize?client_id=a76e983d-cf3b-4f82-b742-6b3086948345&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotion%2Fcallback";
  }
  return (
    <div>
      <button
        className="upload-btn"
        type="button"
        onClick={() => {
          setShow(true);
        }}
      >
        upload
      </button>
      <FullScreenModal show={show} width="70%" height="55%" setShow={setShow}>
        <button type="button" onClick={notionOauthHandler}>
          notion oauth
        </button>
      </FullScreenModal>
    </div>
  );
}
