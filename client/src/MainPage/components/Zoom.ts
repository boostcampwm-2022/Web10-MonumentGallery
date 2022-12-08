import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

export default function Zoom() {
  const { camera } = useThree();
  const [cameraScale, setCameraScale] = useState(1);

  useFrame(() => {
    camera.scale.set(cameraScale, cameraScale, cameraScale);
  });

  useEffect(() => {
    function wheelHandler(e: WheelEvent) {
      if (cameraScale < 100 && e.deltaY > 0) {
        setCameraScale((prev) => prev + e.deltaY / 1000);
      }
      if (cameraScale > 0.2 && e.deltaY < 0) {
        setCameraScale((prev) => prev + e.deltaY / 1000);
      }
    }
    document.addEventListener("wheel", wheelHandler);
    return () => document.removeEventListener("wheel", wheelHandler);
  }, [cameraScale]);
  return null;
}
