import { Stats } from "@react-three/drei";
import { Debug } from "@react-three/rapier";

export default function DevTools() {
  // Physics 컴포넌트 아래에 선언해야 합니다.
  return (
    <>
      <axesHelper />
      <gridHelper args={[10000, 200]} position={[25, 0.2, 25]} />
      <Stats />
      <Debug />
    </>
  );
}
