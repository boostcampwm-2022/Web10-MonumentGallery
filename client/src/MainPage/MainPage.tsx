import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";

import Loading from "./Loading";
import CreateModal from "./components/CreateModal";
import Header from "../components/Header";
import UserInfo from "../components/Header/UserInfo";
import FullScreenModal from "../components/modal/FullScreenModal";

import { CheckLoggedIn } from "../hooks/useLoggedIn";
import userStore from "../store/user.store";

import FloatLayout from "../layouts/FloatLayout";
import "./style.scss";
import MainWorld from "./MainWorld";

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);
  const { isLoggedIn } = userStore();

  function showModal() {
    setShow(true);
  }

  return (
    <>
      <div className="canvas-outer">
        <Canvas
          className="canvas-inner"
          camera={{ fov: 75, near: 0.1, far: 100, position: [10, 15, 10], rotation: [0, Math.PI / 4, 0, "YXZ"] }}
        >
          <MainWorld />
          <axesHelper />
        </Canvas>
      </div>

      <Suspense fallback={<Loading />}>
        <CheckLoggedIn />
        <FloatLayout>
          <Header>
            <UserInfo />
          </Header>
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
      </Suspense>
      <FullScreenModal show={show} css={{ width: "70%", height: "55%" }} setShow={setShow}>
        <CreateModal />
      </FullScreenModal>
    </>
  );
}
