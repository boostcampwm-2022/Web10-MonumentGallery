import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import lockStore from "../../store/lock.store";

export default function FPVControls() {
  const { locked, setLocked } = lockStore();
  const controlsRef = useRef<any>();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

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

  useEffect(() => {
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

    if (locked) {
      controlsRef.current.lock();
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [locked]);
  return (
    <>
      {locked && (
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
      )}
    </>
  );
}
