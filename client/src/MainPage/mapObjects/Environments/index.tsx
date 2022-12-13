import React, { Suspense, useState } from "react";
import { RoadSignMainPageHtml } from "../../../components/RoadSign/RoadSignHtml";
import mainStore from "../../../store/main.store";

const RoadSign = React.lazy(() => import("../../../components/RoadSign"));

export default function Environments() {
  const [showSign, setShowSign] = useState(true);
  const showSplash = mainStore((store) => store.showSplash);

  if (showSplash) return null;

  return (
    <Suspense fallback={null}>
      <RoadSign
        name="mainSign"
        show={showSign}
        setShow={setShowSign}
        offset={[-3, -20, -15]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[2, 2, 2]}
      >
        <RoadSignMainPageHtml />
      </RoadSign>
    </Suspense>
  );
}
