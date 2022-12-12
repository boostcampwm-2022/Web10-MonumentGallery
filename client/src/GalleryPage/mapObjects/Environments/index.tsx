import React, { Suspense, useState } from "react";
import { RoadSignGalleryPageHtml } from "../../../components/RoadSign/RoadSignHtml";
const RoadSign = React.lazy(() => import("../../../components/RoadSign"));

export default function Environments() {
  const [showSign, setShowSign] = useState(true);

  return (
    <Suspense fallback={null}>
      <RoadSign name="gallerySign" show={showSign} setShow={setShowSign} offset={[-10, -10, 0]} scale={[2, 2, 2]}>
        <RoadSignGalleryPageHtml />
      </RoadSign>
    </Suspense>
  );
}
