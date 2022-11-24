import React, { useState } from "react";
import FullScreenModal from "../components/modal/FullScreenModal";
import "./style.scss";
import { Canvas } from "@react-three/fiber";
import FloatLayout from "../layouts/FloatLayout";
import Header from "../components/Header";
import SpaceCreater, { PeriodType, ThemeType } from "../components/SpaceCreater";
import { createResource, Resource } from "../utils/suspender";

interface IPostGalleryResponse {
  page: string;
}

interface IOnLoadFunction {
  <T>(a: T): void;
}

export default function CreatePage() {
  const [show, setShow] = useState<boolean>(true);
  const [resource, setResource] = useState<Resource | null>(null);

  function showModal() {
    setShow(true);
  }

  // refactor plz... da*n typescript
  function onLoad({ page }: IPostGalleryResponse): void {
    window.location.href = page;
  }

  return (
    <>
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
        <SpaceCreater
          resource={resource}
          onSubmit={(period: PeriodType | null, theme: ThemeType | null) => {
            console.log({ period, theme });
            setResource(createResource({ method: "post", url: "/api/gallery", params: { period, theme } }));
          }}
          onLoad={onLoad as IOnLoadFunction}
        />
      </FullScreenModal>
    </>
  );
}
