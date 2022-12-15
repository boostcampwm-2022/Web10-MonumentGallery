import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Cube() {
  return (
    <RigidBody
      position={[0, 0.5, -10]}
      type="fixed"
      colliders="cuboid"
      onCollisionEnter={() => {
        console.log("collision!");
      }}
      onCollisionExit={() => {
        console.log("collision end!");
      }}
    >
      <Box />
    </RigidBody>
  );
}
