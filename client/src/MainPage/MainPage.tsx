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
import testStore from "../store/test.store";

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);
  const { isLoggedIn } = userStore();

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

function Test() {
  const { getTest } = testStore();
  const data = getTest();

  return (
    <div>
      <span>{JSON.stringify(data)}</span>
    </div>
  );
}
