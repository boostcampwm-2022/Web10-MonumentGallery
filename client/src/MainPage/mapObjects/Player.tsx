import { useState, useEffect, useRef, useMemo } from "react";
import { Vector3, Quaternion, Euler } from "three";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated, Interpolation } from "@react-spring/three";

import Ghost from "./Ghost";
import { useKeyMovement } from "../../hooks/useKeyMovement";
import type { Group } from "three";

const _euler = new Euler(0, 0, 0, "YXZ");
const _quaternion = new Quaternion();

function getNewRotation(newDir: Vector3, currentRot: Quaternion) {
  const { x, z } = newDir;
  if (x === 0 && z === 0) {
    _euler.setFromQuaternion(currentRot);
    _euler.x = 0;
    _euler.z = 0;
    return new Quaternion().setFromEuler(_euler);
  }
  _euler.set(Math.PI / 8, Math.atan2(x, z), 0);
  return new Quaternion().setFromEuler(_euler);
}

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
  const [prevRotation, setPrevRotation] = useState(new Quaternion());
  const [currentRotation, setCurrentRotation] = useState(new Quaternion());

  const { spring } = useSpring({
    from: { spring: 0 },
    to: { spring: 1 },
    config: { tension: 320 },
  });

  const ghostRef = useRef<Group>(null);
  const speed = 10;

  useEffect(() => {
    if (!ghostRef.current) return;
    const ghostRotation = ghostRef.current.quaternion;

    const newRotation = getNewRotation(moveDirection, currentRotation);
    setPrevRotation(ghostRotation.clone());
    setCurrentRotation(newRotation);
    spring.start({ from: 0, to: 1 });
  }, [moveDirection, currentRotation]);

  useFrame(({ camera }, delta) => {
    if (!ghostRef.current) return;
    const ghostPos = ghostRef.current.position;
    const ghostRotation = ghostRef.current.quaternion;

    ghostPos.addScaledVector(moveDirection, speed * delta);
    camera.position.copy(ghostPos);
    camera.position.x += 10;
    camera.position.y += 15;
    camera.position.z += 10;

    _quaternion.copy(prevRotation).slerp(currentRotation, spring.get());
    ghostRotation.copy(_quaternion);
  });

  return (
    <animated.group position-y={2} ref={ghostRef}>
      <Ghost />
    </animated.group>
  );
}

export default Player;
