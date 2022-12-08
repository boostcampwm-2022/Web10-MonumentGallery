import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function ScreenshotCapturer() {
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

  return null;
}
