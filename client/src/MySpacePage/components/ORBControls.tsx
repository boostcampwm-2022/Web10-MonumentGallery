import React, { useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import lockStore from "../../store/lock.store";
import toastStore from "../../store/toast.store";
import TOAST from "../../components/Toast/ToastList";
export default function ORBControls() {
  const { locked, setLocked } = lockStore();
  const { addToast } = toastStore();
  const [canSwitch, setCanSwitch] = useState<boolean>(false);

  useEffect(() => {
    if (locked) return;
    setCanSwitch(false);
    setTimeout(() => {
      setCanSwitch(true);
    }, 1500);
  }, [locked]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== "KeyE") return;
      if (!canSwitch) {
        console.log("toast push");
        addToast(TOAST.ERROR());
        return;
      }
      setLocked(true);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [locked, canSwitch]);

  return <>{!locked && <OrbitControls />}</>;
}
