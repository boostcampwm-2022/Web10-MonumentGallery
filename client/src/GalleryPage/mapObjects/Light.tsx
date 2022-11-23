import { useRef, useEffect } from "react";
import { DirectionalLight } from "three";
import { useThree, useFrame, DirectionalLightProps } from "@react-three/fiber";
import { Vector3Arr } from "../../@types/common";

interface ShadowLightProps extends DirectionalLightProps {
  position: Vector3Arr;
}

function ShadowLight({ position, ...props }: ShadowLightProps) {
  const [camX, camY, camZ] = position;
  const lightRef = useRef<DirectionalLight>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (lightRef.current == null) return;
    scene.add(lightRef.current.target);
    return () => {
      if (lightRef.current == null) return;
      scene.remove(lightRef.current.target);
    };
  }, []);
  useFrame(({ camera }) => {
    if (!lightRef.current) return;
    const { x, z } = camera.position;
    lightRef.current.position.set(x + camX, camY, z + camZ);
    lightRef.current.target.position.set(x, 0, z);
  });

  return (
    <directionalLight
      castShadow
      shadow-mapSize={[512, 512]}
      shadow-camera-far={128}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
      {...props}
      ref={lightRef}
    />
  );
}

export default function Light() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <ShadowLight position={[50, 50, 25]} intensity={4} />
    </>
  );
}
