import React, { useState } from "react";
import FullScreenModal from "../components/modal/FullScreenModal";
import "./style.scss";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import FloatLayout from "../layouts/FloatLayout";
import Header from "../components/Header";

export default function CreatePage() {
  const [show, setShow] = useState<boolean>(true);
  function getData() {
    axios
      .get("/test/getData", {
        // withCredentials: true, // 쿠키 cors 통신 설정
      })
      .then((response) => {
        console.log(response);
        console.log(response.data);
      });
  }
  return (
    // <div>
    //   <button
    //     className="upload-btn"
    //     type="button"
    //     onClick={() => {
    //       setShow(true);
    //     }}
    //   >
    //     upload
    //   </button>
    // <FullScreenModal show={show} width="70%" height="55%" setShow={setShow}>
    //   <button type="button" onClick={getData}>
    //     생성
    //   </button>
    // </FullScreenModal>
    // </div>
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
          <button type="button" onClick={getData}>
            <span>생성하기</span>
          </button>
        </div>
        {/* <button type="button" onClick={getData}>
          생성
        </button> */}
      </FullScreenModal>
    </main>
  );
}
