import { useReducer, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Camera } from "three";

interface KeyState {
  [code: string]: boolean;
}

interface KeyStateReducerProps {
  code: string;
  type: "keydown" | "keyup" | "allKeyUp";
}

interface MovementControllerProps {
  camera?: Camera;
  speed?: number;
}

function mapMovementKey(code: string) {
  switch (code) {
    case "ArrowUp":
    case "KeyW":
      return "Front";
    case "ArrowLeft":
    case "KeyA":
      return "Left";
    case "ArrowDown":
    case "KeyS":
      return "Back";
    case "ArrowRight":
    case "KeyD":
      return "Right";
    case "Space":
      return "Up";
    case "ShiftLeft":
      return "Down";
    default:
      return null;
  }
}

function keyStateReducer(state: KeyState, { code, type }: KeyStateReducerProps) {
  switch (type) {
    case "keydown":
      return { ...state, [code]: true };
    case "keyup":
      return { ...state, [code]: false };
    case "allKeyUp":
      return {};
    default:
      throw new Error("invalid command!");
  }
}

function useKeyMovement() {
  const [keyState, controlKeyState] = useReducer(keyStateReducer, {});
  function getKeyState(code: string) {
    return !!keyState[code];
  }

  useEffect(() => {
    function keyDown(e: KeyboardEvent) {
      const movementKey = mapMovementKey(e.code);
      if (movementKey === null) return;
      controlKeyState({ type: "keydown", code: movementKey });
    }
    function keyUp(e: KeyboardEvent) {
      const movementKey = mapMovementKey(e.code);
      if (movementKey === null) return;
      controlKeyState({ type: "keyup", code: movementKey });
    }
    function allRelease() {
      controlKeyState({ type: "allKeyUp", code: "" });
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    window.addEventListener("blur", allRelease);

    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", allRelease);
    };
  }, []);

  return getKeyState;
}

function getCameraXZAxis(camera: Camera) {
  // 카메라의 회전행렬에서 카메라 로컬 x축을 추출
  const rightBasis = new Vector3().setFromMatrixColumn(camera.matrix, 0);
  rightBasis.y = 0;
  rightBasis.normalize();

  // x축과 up 벡터를 이용해 z축 추출. 주의할 점은 카메라의 앞쪽은 z축 기저벡터의 반대 방향이라는 것이다.
  const frontBasis = new Vector3().crossVectors(camera.up, rightBasis);
  return [frontBasis, rightBasis] as const;
}

function MovementController({ camera, speed = 1 }: MovementControllerProps) {
  const isPressed = useKeyMovement();
  const { camera: defaultCamera } = useThree();

  const targetCamera = camera || defaultCamera;
  console.log(targetCamera.position);
  function runMovement(delta: number) {
    const [front, right] = getCameraXZAxis(targetCamera);
    const moveVector = new Vector3();
    if (isPressed("Front")) {
      moveVector.addScaledVector(front, 1);
    }
    if (isPressed("Back")) {
      moveVector.addScaledVector(front, -1);
    }
    if (isPressed("Right")) {
      moveVector.addScaledVector(right, 1);
    }
    if (isPressed("Left")) {
      moveVector.addScaledVector(right, -1);
    }
    if (isPressed("Up")) {
      moveVector.y += 1;
    }
    if (isPressed("Down")) {
      moveVector.y -= 1;
    }
    moveVector.normalize();
    targetCamera.position.addScaledVector(moveVector, speed * delta);
  }

  useFrame((_, delta) => {
    runMovement(delta);
  });

  return <primitive object={{}} />;
}

export default MovementController;
