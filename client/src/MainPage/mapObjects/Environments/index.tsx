import React, { Suspense, useState } from "react";
import mainStore from "../../../store/main.store";

const RoadSign = React.lazy(() => import("./RoadSign"));

export default function Environments() {
  const [showSign, setShowSign] = useState(true);
  const { showSplash } = mainStore();

  if (showSplash) return null;

  return (
    <Suspense fallback={null}>
      <RoadSign show={showSign} setShow={setShowSign} rotation={[0, -Math.PI / 2, 0]} scale={[2, 2, 2]} />
    </Suspense>
  );
}
