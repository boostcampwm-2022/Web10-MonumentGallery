import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function useScreenshotCapture() {
  const { gl, scene, camera } = useThree();
  const virtualLink = useRef(document.createElement("a"));

  function saveBlob(blob: Blob | null) {
    if (!virtualLink.current || blob === null) return;
    const img = window.URL.createObjectURL(blob);
    virtualLink.current.href = img;
    virtualLink.current.download = "Monument Gallery";
    virtualLink.current.click();
    window.URL.revokeObjectURL(img);
  }

  useEffect(() => {
    function saveScreenshot() {
      gl.render(scene, camera);
      gl.domElement.toBlob((blob) => saveBlob(blob));
    }
    document.addEventListener("save-screenshot", saveScreenshot);
    return () => document.removeEventListener("save-screenshot", saveScreenshot);
  }, []);
}
