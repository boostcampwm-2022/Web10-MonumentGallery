import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";

interface FPVControlsProps {
  locked: boolean;
  setLocked: (lock: boolean) => void;
}

export default function FPVControls({ locked, setLocked }: FPVControlsProps) {
  const controlsRef = useRef<any>(null!);
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  useEffect(() => {
    if (locked) {
      controlsRef.current.lock();
    }
  });
  useFrame(() => {
    const velocity = 0.05;
    if (moveForward) {
      controlsRef.current.moveForward(velocity);
    } else if (moveLeft) {
      controlsRef.current.moveRight(-velocity);
    } else if (moveBackward) {
      controlsRef.current.moveForward(-velocity);
    } else if (moveRight) {
      controlsRef.current.moveRight(velocity);
    }
  });

  function onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        setMoveForward(true);
        break;

      case "ArrowLeft":
      case "KeyA":
        setMoveLeft(true);
        break;

      case "ArrowDown":
      case "KeyS":
        setMoveBackward(true);
        break;

      case "ArrowRight":
      case "KeyD":
        setMoveRight(true);
        break;
      default:
        return;
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        setMoveForward(false);
        break;

      case "ArrowLeft":
      case "KeyA":
        setMoveLeft(false);
        break;

      case "ArrowDown":
      case "KeyS":
        setMoveBackward(false);
        break;

      case "ArrowRight":
      case "KeyD":
        setMoveRight(false);
        break;

      case "KeyE":
        setLocked(true);
        break;

      default:
        return;
    }
  }

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  return (
    <PointerLockControls
      onUpdate={() => {
        if (controlsRef.current) {
          controlsRef.current.addEventListener("lock", () => {
            setLocked(true);
          });
          controlsRef.current.addEventListener("unlock", () => {
            setLocked(false);
          });
        }
      }}
      ref={controlsRef}
    />
  );
}
