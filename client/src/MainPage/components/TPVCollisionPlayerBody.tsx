import { useRef } from "react";
import { CapsuleCollider, RigidBody, RigidBodyApi, Vector3Array } from "@react-three/rapier";

export default function TPVCollisionPlayerBody({ position }: { position: Vector3Array }) {
  const ref = useRef<RigidBodyApi>(null);

  return (
    <RigidBody
      ref={ref}
      colliders={false}
      mass={1}
      type="dynamic"
      lockTranslations
      position={position}
      enabledRotations={[false, false, false]}
    >
      {/* <mesh scale={[1, 1, 1]}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}
