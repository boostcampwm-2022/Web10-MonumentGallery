import React, { Suspense, useState } from "react";
import FullScreenModal from "../components/modal/FullScreenModal";
import "./style.scss";
import { Canvas } from "@react-three/fiber";
import FloatLayout from "../layouts/FloatLayout";
import Header from "../components/Header";
import { fetchData } from "./api/fetchData";

export default function CreatePage() {
  const [show, setShow] = useState<boolean>(true);
  const [fetcher, setFetcher] = useState<{ get: () => void } | boolean>(false);

  function showModal() {
    setShow(true);
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
        <button className="upload-btn" type="button" onClick={showModal}>
          Upload
        </button>
      </FloatLayout>
      <FullScreenModal show={show} width="70%" height="55%" setShow={setShow}>
        <div className="create-modal">
          <span className="make-gallery">갤러리 만들기</span>

          {fetcher ? (
            <Suspense fallback={<button>로딩중...</button>}>
              <Data resource={fetcher} />
            </Suspense>
          ) : (
            <button onClick={() => setFetcher(fetchData())}>생성하기</button>
          )}
        </div>
      </FullScreenModal>
    </main>
  );
}

function Data({ resource }: { resource: any }) {
  const data = resource.get();
  return <div style={{ overflow: "scroll" }}>{JSON.stringify(data, null, 2)}</div>;
}
