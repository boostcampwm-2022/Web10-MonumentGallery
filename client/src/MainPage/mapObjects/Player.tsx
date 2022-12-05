import { useRef } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

import Ghost from "./Ghost";
import { useKeyMovement } from "../../hooks/useKeyMovement";
import type { Group } from "three";
import { Box } from "@react-three/drei";

const _vector3 = new Vector3();

function Player() {
  const isPressed = useKeyMovement();
  const ghostRef = useRef<Group>(null);
  const speed = 10;

  function getMoveVector() {
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

  useFrame(({ camera }, delta) => {
    if (!ghostRef.current) return;
    const ghostPos = ghostRef.current.position;

    const moveVector = getMoveVector(delta);
    ghostPos.addScaledVector(moveVector, speed * delta);
    camera.position.copy(ghostPos);
    camera.position.x += 10;
    camera.position.y += 15;
    camera.position.z += 10;
  });

  return (
    <group position-y={2} ref={ghostRef}>
      <Ghost />
    </group>
  );
}

export default Player;
