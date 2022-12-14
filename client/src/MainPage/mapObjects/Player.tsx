import { useState, useEffect, useRef, useMemo } from "react";
import { Vector3, Quaternion, Euler } from "three";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import { CapsuleCollider, RigidBody, RigidBodyApi } from "@react-three/rapier";

import Ghost from "./Ghost";
import { useKeyMovement } from "../../hooks/useKeyMovement";
import settingStore from "../../store/setting.store";
import { MAIN_CAMERA_Y, MAIN_CAMERA_Z } from "../../constants/positions";

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
  const rigidRef = useRef<RigidBodyApi>(null);
  const rigidUpdateTime = useRef(0);
  const speed = settingStore((store) => store.speed);

  useEffect(() => {
    if (!ghostRef.current) return;
    const ghostRotation = ghostRef.current.quaternion;

    const newRotation = getNewRotation(moveDirection, currentRotation);
    setPrevRotation(ghostRotation.clone());
    setCurrentRotation(newRotation);
    spring.start({ from: 0, to: 1 });
  }, [moveDirection]);

  useFrame(({ camera }, frame) => {
    if (!ghostRef.current) return;
    if (!rigidRef.current) return;
    const ghostPosition = ghostRef.current.position;
    const ghostRotation = ghostRef.current.quaternion;

    ghostPosition.addScaledVector(moveDirection, speed * frame);

    camera.position.copy(ghostPosition);
    camera.position.y += MAIN_CAMERA_Y;
    camera.position.z += MAIN_CAMERA_Z;

    _quaternion.copy(prevRotation).slerp(currentRotation, spring.get());
    ghostRotation.copy(_quaternion);

    if (moveDirection.x !== 0 || moveDirection.z !== 0) rigidUpdateTime.current += frame;
    else if (rigidUpdateTime.current !== 0.125) rigidUpdateTime.current = 0;
    if (rigidUpdateTime.current >= 0) {
      rigidRef.current.setTranslation(ghostPosition);
      rigidUpdateTime.current -= 0.125;
    }
  });

  return (
    <>
      <group ref={ghostRef} position-y={2}>
        <Ghost scale={[0.5, 0.5, 0.5]} />
      </group>
      <RigidBody
        ref={rigidRef}
        position-y={2}
        colliders={false}
        mass={1}
        type="dynamic"
        lockTranslations
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[1, 1]} />
      </RigidBody>
    </>
  );
}

export default Player;
