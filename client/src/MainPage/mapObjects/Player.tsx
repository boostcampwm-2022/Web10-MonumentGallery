import * as THREE from "three";
import { MathUtils } from "three";
import React, { useMemo, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3Array } from "@react-three/rapier";
import { useSpring, animated, Interpolation } from "@react-spring/three";

import Ghost from "./Ghost";
import TPVCollisionPlayerBody from "../components/TPVCollisionPlayerBody";

import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import GHOST_ROTATE_ANIMATION from "../animations/ghost.animation";

const DIRECTION = {
  E: ["E", (Math.PI / 4) * 3],
  SE: ["SE", Math.PI / 2],
  S: ["S", Math.PI / 4],
  SW: ["SW", 0],
  W: ["W", -Math.PI / 4],
  NW: ["NW", -Math.PI / 2],
  N: ["N", (-Math.PI / 4) * 3],
  NE: ["NE", Math.PI],
} as const;

type DIRECTION = typeof DIRECTION[keyof typeof DIRECTION];

function Player({ ghostParent }: { ghostParent: THREE.Group | null }) {
  const { camera } = useThree();
  const collisionRef = useRef<THREE.Group>(null);
  const ghostRef = useRef<THREE.Group>(null);
  const [animationTrigged, setAnimationTrigged] = useState(false);
  const { spring, ready, playing } = useTriggeredSpring(animationTrigged, {
    tension: 50,
    friction: 10,
    precision: 0.1,
  });

  const [curRotation, setCurRotation] = useState<DIRECTION>(DIRECTION.S);
  const [destRotation, setDestRotation] = useState<DIRECTION>(DIRECTION.S);
  const [distRotation, setDistRotation] = useState(0);

  const rotation = useMemo<Interpolation<number, number>>(
    () => spring.to([0, 1], [curRotation[1], curRotation[1] + distRotation]),
    [animationTrigged],
  );

  function getDirection(directionVector: [x: number, z: number]) {
    const [x, z] = directionVector;
    if (x === 1 && z === -1) return DIRECTION.E;
    if (x === 1 && z === 0) return DIRECTION.SE;
    if (x === 1 && z === 1) return DIRECTION.S;
    if (x === 0 && z === 1) return DIRECTION.SW;
    if (x === -1 && z === 1) return DIRECTION.W;
    if (x === -1 && z === 0) return DIRECTION.NW;
    if (x === -1 && z === -1) return DIRECTION.N;
    if (x === 0 && z === -1) return DIRECTION.NE;
    return false;
  }

  function calDirection(prev: Vector3Array, next: Vector3Array): [x: number, z: number] {
    const [x, , z] = prev.map((e, i) => {
      const value: number = next[i] - e;
      if (Math.abs(value) < 0.01) return 0;
      return value < 0 ? -1 : 1;
    });
    return [x, z];
  }

  useFrame(({ clock }) => {
    // const timer = clock.getElapsedTime();
    // if ((timer * 1000) % 10 === 0) {
    //   return;
    // }

    if (!ghostParent) return;
    if (!ghostRef.current) return;
    const { x, y, z } = camera.position;
    const prevPosition = ghostRef.current.position.toArray();
    const newPosition: Vector3Array = [x - 10, y - 13, z - 10];
    const directionVector = calDirection(prevPosition, newPosition);
    const direction = getDirection(directionVector);
    collisionRef.current?.position.set(newPosition[0], newPosition[1], newPosition[2]);
    ghostRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);
    // TODO: react-spring으로 바뀐 방향에 따라 애니메이션 넣어주기
    camera.lookAt(new THREE.Vector3(ghostRef.current.position.x, 0, ghostRef.current.position.z));
    /*
      1. 애니메이션 트리거 해야됨
      2. 애니메이션이 재생중이면 트리거하면 안됨
    */

    if (!direction) {
      ghostRef.current.position.y += Math.sin(clock.getElapsedTime() * 5) * 0.004;
      return;
    }

    if (curRotation === direction) {
      console.log("같은 방향입니다.");
      return;
    }

    if (!playing) {
      console.log("애니메이션 종료");
      setAnimationTrigged(false);
      setCurRotation(destRotation);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setDistRotation(GHOST_ROTATE_ANIMATION[curRotation[0]][direction[0]]);
    setDestRotation(direction);

    if (animationTrigged) return;
    setAnimationTrigged(true);
  });

  return (
    <>
      <group ref={collisionRef}>
        <TPVCollisionPlayerBody position={[0, 0, 0]} />
      </group>
      <animated.group rotation-y={rotation} position={[0, 0, 0]} ref={ghostRef} scale={[2, 2, 2]} dispose={null}>
        <Ghost />
      </animated.group>
    </>
  );
}

export default Player;
