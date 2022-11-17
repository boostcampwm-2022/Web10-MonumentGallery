import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function TPVControls() {
  // const { camera } = useThree();
  // const [moveForward, setMoveForward] = useState(false);
  // const [moveBackward, setMoveBackward] = useState(false);
  // const [moveLeft, setMoveLeft] = useState(false);
  // const [moveRight, setMoveRight] = useState(false);

  // useFrame(() => {
  //   if (moveForward) {
  //     camera.position.z -= 1;
  //   } else if (moveLeft) {
  //     camera.position.x -= 1;
  //   } else if (moveBackward) {
  //     camera.position.z += 1;
  //   } else if (moveRight) {
  //     camera.position.x += 1;
  //   }
  // });

  // function onKeyDown(event: KeyboardEvent) {
  //   switch (event.code) {
  //     case "ArrowUp":
  //     case "KeyW":
  //       setMoveForward(true);
  //       break;

  //     case "ArrowLeft":
  //     case "KeyA":
  //       setMoveLeft(true);
  //       break;

  //     case "ArrowDown":
  //     case "KeyS":
  //       setMoveBackward(true);
  //       break;

  //     case "ArrowRight":
  //     case "KeyD":
  //       setMoveRight(true);
  //       break;
  //     default:
  //       return;
  //   }
  // }

  // function onKeyUp(event: KeyboardEvent) {
  //   switch (event.code) {
  //     case "ArrowUp":
  //     case "KeyW":
  //       setMoveForward(false);
  //       break;

  //     case "ArrowLeft":
  //     case "KeyA":
  //       setMoveLeft(false);
  //       break;

  //     case "ArrowDown":
  //     case "KeyS":
  //       setMoveBackward(false);
  //       break;

  //     case "ArrowRight":
  //     case "KeyD":
  //       setMoveRight(false);
  //       break;

  //     default:
  //       return;
  //   }
  // }

  // document.addEventListener("keydown", onKeyDown);
  // document.addEventListener("keyup", onKeyUp);
  return <OrbitControls />;
}
