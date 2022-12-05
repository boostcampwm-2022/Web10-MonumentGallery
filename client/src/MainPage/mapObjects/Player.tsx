import { useRef, useMemo } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

import Ghost from "./Ghost";
import { useKeyMovement } from "../../hooks/useKeyMovement";
import type { Group } from "three";

const _vector3 = new Vector3();

function Player() {
  const isPressed = useKeyMovement();
  const moveDirection = useMemo(() => {
    let front = 0;
    let right = 0;
    if (isPressed("Front")) front--;
    if (isPressed("Back")) front++;
    if (isPressed("Right")) right++;
    if (isPressed("Left")) right--;
    return new Vector3(right, 0, front).normalize();
  }, [isPressed("Front"), isPressed("Back"), isPressed("Left"), isPressed("Right")]);

  const ghostRef = useRef<Group>(null);
  const speed = 10;

  useFrame(({ camera }, delta) => {
    if (!ghostRef.current) return;
    const ghostPos = ghostRef.current.position;

    ghostPos.addScaledVector(moveDirection, speed * delta);
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
