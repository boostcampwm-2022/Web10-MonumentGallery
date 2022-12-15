import { Vector3 } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, RigidBodyApi } from "@react-three/rapier";

const _vector3 = new Vector3();

export default function CollisionPlayerBody() {
  const ref = useRef<RigidBodyApi>(null);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current.setTranslation(_vector3(camera.position.x, 1, camera.position.z));
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
