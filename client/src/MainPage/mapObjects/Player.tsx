import { useRef } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

import Ghost from "./Ghost";
import { useKeyMovement } from "../../hooks/useKeyMovement";
import type { Group } from "three";

const _vector3 = new Vector3();

function Player() {
  const isPressed = useKeyMovement();
  const ghostRef = useRef<Group>(null);
  const speed = 10;

  function getMoveVector(delta: number) {
    let front = 0;
    let right = 0;
    if (isPressed("Front")) front--;
    if (isPressed("Back")) front++;
    if (isPressed("Right")) right++;
    if (isPressed("Left")) right--;
    _vector3.set(right, 0, front);
    _vector3.normalize();
    return _vector3;
  }

  useFrame((_, delta) => {
    if (!ghostRef.current) return;

    const moveVector = getMoveVector(delta);
    ghostRef.current.position.addScaledVector(moveVector, speed * delta);
  });

  return (
    <group position-y={2} ref={ghostRef}>
      <Ghost />
    </group>
  );
}

export default Player;
