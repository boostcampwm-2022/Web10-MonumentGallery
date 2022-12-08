import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import galleryStore from "../../store/gallery.store";
import { THEME } from "../../@types/gallery";
import { GROUND_TEXTURES } from "../../@types/main";

export default function Ground() {
  const theme = galleryStore((store) => store.theme);
  const texture = useTexture(GROUND_TEXTURES[theme || THEME.DREAM]);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return (
    <mesh receiveShadow position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={texture} map-repeat={[100, 100]} color="#999999" />
    </mesh>
  );
}
