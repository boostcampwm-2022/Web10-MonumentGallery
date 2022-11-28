import { useState, useEffect, useRef, useMemo } from "react";
import { UniformsUtils, Color, Mesh } from "three";
import { MeshProps } from "@react-three/fiber";
import { animated, Interpolation } from "@react-spring/three";

import PixelFragmentGeometry from "./pixelFragmentGeometry";
import PixelFragmentShader from "./pixelFragmentShader";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";

type IColor = Color | string | number;

interface PictureFragmentsProps extends MeshProps {
  pixels: IColor[][];
  size?: number;
  scatterRadius?: number;
}

export default function PictureFragments({ pixels, size = 3, scatterRadius = 8, ...props }: PictureFragmentsProps) {
  const meshRef = useRef<Mesh>(null);
  const [activate, setActivate] = useState(false);
  const { spring } = useTriggeredSpring(activate, { tension: 500, friction: 150, precision: 0.04 });
  const geometry = useMemo(() => new PixelFragmentGeometry(pixels, size, scatterRadius), [pixels, size, scatterRadius]);
  const matUniforms = useMemo(() => UniformsUtils.clone(PixelFragmentShader.uniforms), []);
  const lerp: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [1, 0]), []);

  useEffect(() => {
    if (!geometry) return;
    geometry.syncronizeVertex(+!activate);
  }, [activate]);

  function toggleActivate() {
    return setActivate((prev) => !prev);
  }

  return (
    <mesh {...props} geometry={geometry} onClick={toggleActivate} ref={meshRef}>
      <animated.shaderMaterial {...PixelFragmentShader} uniforms={matUniforms} uniforms-lerp-value={lerp} />
    </mesh>
  );
}
