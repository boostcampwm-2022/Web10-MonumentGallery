import { useState, useRef, useMemo } from "react";
import { UniformsUtils, Color } from "three";
import { MeshProps } from "@react-three/fiber";
import { Interpolation } from "@react-spring/three";

import PixelFragmentGeometry from "./pixelFragmentGeometry";
import PixelFragmentShader from "./pixelFragmentShader";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";

type IColor = Color | string | number;

interface PictureFragmentsProps extends MeshProps {
  pixels: IColor[][];
  size?: number;
  scatterRadius?: number;
}

export default function PictureFragments({ pixels, size = 3, scatterRadius = 9, ...props }: PictureFragmentsProps) {
  const meshRef = useRef(null);
  const material = useRef(null);
  const [activate, setActivate] = useState(false);
  const { spring } = useTriggeredSpring(activate, { tension: 500, friction: 150, precision: 0.04 });
  const geometry = useMemo(() => new PixelFragmentGeometry(pixels, size, scatterRadius), [pixels, size, scatterRadius]);
  const matUniforms = useMemo(() => UniformsUtils.clone(PixelFragmentShader.uniforms), []);
  const lerp: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [1, 0]), []);

  function toggleActivate() {
    if (!material.current || !meshRef.current) return;
    material.current.uniforms.lerp.value = +activate;
    meshRef.current.updateMatrix();
    console.log("yes");

    return setActivate((prev) => !prev);
  }

  return (
    <mesh {...props} geometry={geometry} onClick={toggleActivate} ref={meshRef}>
      <shaderMaterial {...PixelFragmentShader} uniforms={matUniforms} ref={material} />
    </mesh>
  );
}
