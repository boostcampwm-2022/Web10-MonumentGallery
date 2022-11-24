import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import Header from "../components/Header";
import FullScreenModal from "../components/modal/FullScreenModal";
import FloatLayout from "../layouts/FloatLayout";
import NotionIcon from "../assets/images/notion-icon.png";
import "./style.scss";
import { createResource } from "../utils/suspender";
import userStore from "../store/user.store";
import { CheckLoggedIn } from "../hooks/useLoggedIn";
import Loading from "./Loading";

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);
  const { isLoggedIn } = userStore();

  function notionOauthHandler() {
    window.location.href = "/auth/login";
  }

  function showModal() {
    setShow(true);
  }

  return (
    <>
      <div className="canvas-outer">
        <Canvas className="canvas-inner">
          <mesh></mesh>
        </Canvas>
      </div>

      <Suspense fallback={<Loading />}>
        <CheckLoggedIn resource={createResource()} />
        <FloatLayout>
          <Header />
          {isLoggedIn ? (
            <button className="my-monument-btn" type="button" onClick={showModal}>
              My Monument
            </button>
          ) : (
            <button className="upload-btn" type="button" onClick={showModal}>
              Upload
            </button>
          )}
        </FloatLayout>
        <FullScreenModal show={show} width="70%" height="55%" setShow={setShow}>
          <div className="create-modal">
            <span className="make-gallery">갤러리 만들기</span>
            <button type="button" onClick={notionOauthHandler}>
              <img width={25} height={25} src={NotionIcon} />
              {isLoggedIn ? <span>페이지 가져오기</span> : <span>Notion Login</span>}
            </button>
          </div>
        </FullScreenModal>
      </Suspense>
    </>
  );
}
