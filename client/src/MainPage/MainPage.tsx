import "./style.scss";
import React, { Suspense, useRef, useState } from "react";

import Loading from "./Loading";
import MainWorld from "./MainWorld";
import CreateModal from "./components/CreateModal";
import Header from "../components/Header";
import UserInfo from "../components/Header/UserInfo";
import FullScreenModal from "../components/modal/FullScreenModal";

import { CheckLoggedIn } from "../hooks/useLoggedIn";
import userStore from "../store/user.store";

import FloatLayout from "../layouts/FloatLayout";
import CanvasLoading from "../components/CanvasLoading";
import { Canvas } from "@react-three/fiber";
import { BACKGROUND_COLORS } from "../@types/colors";
import themeStore from "../store/theme.store";
import { THEME } from "../@types/gallery";
import { PerspectiveCamera } from "@react-three/drei";

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { theme } = themeStore();
  const { isLoggedIn } = userStore();

  function showModal() {
    setShow(true);
  }

  return (
    <>
      <div className="canvas-outer">
        <Suspense fallback={<CanvasLoading />}>
          <Canvas
            shadows
            className="canvas-inner"
            // camera={{ fov: 75, near: 0.1, far: 100, position: [0, 3, 5], rotation: [0.4, 0, 0] }}
            // camera={cameraRef.current}
            style={{ backgroundColor: (theme && BACKGROUND_COLORS[theme]) || THEME.DREAM }}
          >
            {cameraRef.current && <MainWorld cameraRef={cameraRef} />}
            <PerspectiveCamera
              makeDefault={true}
              position={[0, 13, 10]}
              near={0.1}
              far={100}
              ref={cameraRef}
            ></PerspectiveCamera>
          </Canvas>
        </Suspense>
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
