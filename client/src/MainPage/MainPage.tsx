import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import Header from "../components/Header";
import FullScreenModal from "../components/modal/FullScreenModal";
import FloatLayout from "../layouts/FloatLayout";
import NotionIcon from "../assets/images/notion-icon.png";
import "./style.scss";
import axios from "axios";

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);
  function notionOauthHandler() {
    axios.get("/auth/notion/oauth", { withCredentials: true });
    // window.location.href =
    //   "https://api.notion.com/v1/oauth/authorize?client_id=a76e983d-cf3b-4f82-b742-6b3086948345&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotion%2Fcallback";
  }
  return (
    <main>
      <div className="canvas-outer">
        <Canvas className="canvas-inner">
          <mesh></mesh>
        </Canvas>
      </div>
      <FloatLayout>
        <Header />
        <button
          className="upload-btn"
          type="button"
          onClick={() => {
            setShow(true);
          }}
        >
          Upload
        </button>
      </FloatLayout>
      <FullScreenModal show={show} width="70%" height="55%" setShow={setShow}>
        <div className="create-modal">
          <span className="make-gallery">갤러리 만들기</span>
          <button type="button" onClick={notionOauthHandler}>
            <img width={25} height={25} src={NotionIcon} />
            <span>Notion Login</span>
          </button>
        </div>
      </FullScreenModal>
    </main>
  );
}
