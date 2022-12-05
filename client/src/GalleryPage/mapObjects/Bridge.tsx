import { Vector3, Quaternion } from "three";
import { Vector3Arr } from "../../@types/common";
import galleryStore from "../../store/gallery.store";
import { BRIDGE_COLORS } from "../../@types/colors";
import { THEME } from "../../@types/gallery";

interface BridgeProps {
  start: Vector3Arr;
  end: Vector3Arr;
  width?: number;
  height?: number;
}

function propToVector3(valueToApply: Vector3Arr) {
  return new Vector3(...valueToApply);
}

export default function Bridge({ start, end, width = 1.5, height = 0.4 }: BridgeProps) {
  const startPosition = propToVector3(start);
  const endPosition = propToVector3(end);
  const distance = startPosition.distanceTo(endPosition);
  const directionVector = new Vector3().subVectors(endPosition, startPosition).normalize();

  const bridgePosition = new Vector3().lerpVectors(startPosition, endPosition, 0.5);
  bridgePosition.y -= height * 0.6;
  const rotation = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), directionVector);
  const theme = galleryStore((store) => store.theme);

  return (
    <mesh position={bridgePosition} quaternion={rotation}>
      <boxGeometry args={[distance, height, width]} />
      <meshStandardMaterial color={(theme && BRIDGE_COLORS[theme]) || THEME.DREAM} flatShading={true} />
    </mesh>
  );
}
