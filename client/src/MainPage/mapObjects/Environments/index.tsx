import React, { Suspense, useState } from "react";

const RoadSign = React.lazy(() => import("./RoadSign"));

export default function Environments() {
  const [showSign, setShowSign] = useState(true);
  return (
    <Suspense fallback={null}>
      <RoadSign show={showSign} setShow={setShowSign} rotation={[0, -Math.PI / 2, 0]} scale={[2, 2, 2]} />
    </Suspense>
  );
}
