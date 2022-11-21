import { Vector3, Quaternion } from "three";
import { Vector3 as IVector3, Color, applyProps } from "@react-three/fiber";

interface BridgeProps {
  start: IVector3;
  end: IVector3;
  width?: number;
  height?: number;
  color?: Color;
}

function propToVector3(valueToApply: IVector3) {
  const result = { vector: new Vector3() };
  applyProps(result, { vector: valueToApply });
  return result.vector;
}

export default function Bridge({ start, end, width = 1.5, height = 0.4, color = 0xffffff }: BridgeProps) {
  const startPosition = propToVector3(start);
  const endPosition = propToVector3(end);
  const distance = startPosition.distanceTo(endPosition);
  const directionVector = new Vector3().subVectors(endPosition, startPosition).normalize();

  const bridgePosition = new Vector3().lerpVectors(startPosition, endPosition, 0.5);
  bridgePosition.y -= height * 0.6;
  const rotation = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), directionVector);

  return (
    <mesh position={bridgePosition} quaternion={rotation}>
      <boxGeometry args={[distance, height, width]} />
      <meshStandardMaterial color={color} flatShading={true} />
    </mesh>
  );
}
