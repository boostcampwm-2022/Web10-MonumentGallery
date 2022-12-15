import { useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import { useOBJGeometry } from "../../hooks/useObjGeometry";

import SignPillarObj from "../../assets/models/sign-pillar.obj?url";
import SignObj from "../../assets/models/sign.obj?url";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
import type { IGroupKeywordData } from "../../@types/gallery";

interface SignProps {
  direction: number;
  text: string;
}
interface SignsProps {
  groupKeywords: IGroupKeywordData[];
}

function Sign({ direction, text }: SignProps) {
  const pillar = useOBJGeometry(SignPillarObj);
  const sign = useOBJGeometry(SignObj);

  const xDir = [6.5, 1, -6.5, -1];
  const zDir = [1, 6.5, -1, -6.5];
  const rotateDir = [-1.5, 3, 1.5, 0];
  return (
    <group>
      <mesh castShadow geometry={pillar} position-x={xDir[direction]} position-z={zDir[direction]}>
        <meshLambertMaterial color="#ff4d00" />
      </mesh>
      <mesh
        castShadow
        geometry={sign}
        position-x={xDir[direction]}
        position-z={zDir[direction]}
        rotation-y={rotateDir[direction]}
      >
        <meshLambertMaterial color="#ff4b00" />
        <Text
          font={MapoFlowerIsland}
          color="black"
          fontSize={0.3}
          anchorX="center"
          anchorY="middle"
          position-z={-1}
          position-x={0.07}
          position-y={3.5}
          rotation-y={1.55}
        >
          {text}
        </Text>
        <Text
          font={MapoFlowerIsland}
          color="black"
          fontSize={0.3}
          anchorX="center"
          anchorY="middle"
          position-z={-1}
          position-x={-0.07}
          position-y={3.5}
          rotation-y={-1.55}
        >
          {text}
        </Text>
      </mesh>
    </group>
  );
}

export default function Signs({ groupKeywords }: SignsProps) {
  return (
    <>
      {groupKeywords.map((data, idx) => {
        let dir = -1;
        if (data.position[0] !== 0) {
          dir = data.position[0] > 0 ? 0 : 2;
        } else if (data.position[1] !== 0) {
          dir = data.position[1] > 0 ? 1 : 3;
        }
        if (dir === -1) return null;
        else return <Sign direction={dir} text={data.keyword} key={idx} />;
      })}
    </>
  );
}

useLoader.preload(OBJLoader, SignPillarObj);
useLoader.preload(OBJLoader, SignObj);
