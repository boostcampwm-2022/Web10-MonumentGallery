import { Vector3 } from "three";
import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, RigidBodyApi } from "@react-three/rapier";

export default function CollisionPlayerBody() {
  const ref = useRef<RigidBodyApi>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.setTranslation(new Vector3(camera.position.x, 1, camera.position.z));
  });
  return (
    <RigidBody
      ref={ref}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 10, 5]}
      lockTranslations
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}
