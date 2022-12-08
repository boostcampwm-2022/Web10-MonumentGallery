import { useMemo, useRef } from "react";
import { extend, BufferGeometryNode, useFrame } from "@react-three/fiber";
import { animated } from "@react-spring/three";

import BoxEffectGeometry from "./EffectGeometry";
import effectShader, { effectShaderUniforms } from "./EffectShader";
import useTriggeredSpring from "../../../hooks/useTriggeredSpring";

// extend effect geometry so that vite parse effectGeometry component
extend({ BoxEffectGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    boxEffectGeometry: BufferGeometryNode<BoxEffectGeometry, typeof BoxEffectGeometry>;
  }
}

interface LinkPedalEffectProps {
  active: boolean;
}

export default function LinkPedalEffect({ active }: LinkPedalEffectProps) {
  const { spring, active: animActive } = useTriggeredSpring(active, {});
  const positionY = useMemo(() => spring.to([0, 1], [-0.3, 0]), []);
  const uniforms = useRef(effectShaderUniforms());

  useFrame(({ clock }) => {
    if (!animActive || !uniforms.current) return;
    const timer = clock.getElapsedTime();
    uniforms.current.time.value = timer;
  });

  return (
    <animated.mesh position-y={positionY} visible={animActive}>
      <boxEffectGeometry />
      <shaderMaterial {...effectShader} uniforms={uniforms.current} />
    </animated.mesh>
  );
}
