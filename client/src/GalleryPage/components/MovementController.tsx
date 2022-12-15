import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Camera } from "three";

import { useKeyMovement } from "../../hooks/useKeyMovement";

interface MovementControllerProps {
  camera?: Camera;
  speed?: number;
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
