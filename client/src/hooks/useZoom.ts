import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

export default function useZoom() {
  const [cameraScale, setCameraScale] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 1.5;

  useFrame(({ camera }) => {
    camera.scale.set(cameraScale, cameraScale, cameraScale);
  });

  useEffect(() => {
    function wheelHandler(e: WheelEvent) {
      if (cameraScale < MAX_ZOOM && e.deltaY > 0) {
        setCameraScale((prev) => Math.min(prev + e.deltaY / 1000, MAX_ZOOM));
      }
      if (cameraScale > MIN_ZOOM && e.deltaY < 0) {
        setCameraScale((prev) => Math.max(prev + e.deltaY / 1000, MIN_ZOOM));
      }
    }
    document.addEventListener("wheel", wheelHandler);
    return () => document.removeEventListener("wheel", wheelHandler);
  }, [cameraScale]);
}
