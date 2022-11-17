import React from "react";
import { OrbitControls } from "@react-three/drei";

interface ORBControlsProps {
  setLocked: (lock: boolean) => void;
}

export default function ORBControls({ setLocked }: ORBControlsProps) {
  function onKeyDown(event: KeyboardEvent) {
    if (event.code === "KeyE") {
      setLocked(true);
    }
  }

  document.addEventListener("keydown", onKeyDown);
  return <OrbitControls />;
}
