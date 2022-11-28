import { useState, useEffect, useRef, useMemo } from "react";
import { UniformsUtils, Color, Vector3, Quaternion, Mesh, Camera, Object3D } from "three";
import { useThree, MeshProps } from "@react-three/fiber";
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

function getCameraRotation(camera: Camera, object: Object3D) {
  const result = camera.quaternion.clone();
  if (object.parent) {
    const parentWorldQuaternion = new Quaternion();
    object.parent.getWorldQuaternion(parentWorldQuaternion);
    result.premultiply(parentWorldQuaternion.invert());
  }
  return result;
}

function getCameraFrontPosition(camera: Camera, object: Object3D, dist: number) {
  const zBasis = new Vector3().setFromMatrixColumn(camera.matrix, 2).normalize();
  const result = camera.position.clone().addScaledVector(zBasis, -dist);

  if (object.parent) {
    const parentWorldPos = new Vector3();
    object.parent.getWorldPosition(parentWorldPos);
    result.addScaledVector(parentWorldPos, -1);
  }
  return result;
}

export default function PictureFragments({ pixels, size = 3, scatterRadius = 8, ...props }: PictureFragmentsProps) {
  const { camera } = useThree();
  const meshRef = useRef<Mesh>(null);
  const [activate, setActivate] = useState(false);
  const [destPosition, setDestPosition] = useState(new Vector3());
  const [destRotation, setDestRotation] = useState(new Quaternion());
  const { spring } = useTriggeredSpring(activate, {});
  const geometry = useMemo(() => new PixelFragmentGeometry(pixels, size, scatterRadius), [pixels, size, scatterRadius]);
  const matUniforms = useMemo(() => UniformsUtils.clone(PixelFragmentShader.uniforms), []);

  const lerp: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [1, 0]), []);
  const position: Interpolation<number, Vector3> = useMemo(
    () =>
      spring.to((i) => {
        return new Vector3().lerp(destPosition, i);
      }),
    [destPosition],
  );
  const rotation: Interpolation<number, Quaternion> = useMemo(
    () =>
      spring.to((i) => {
        return new Quaternion().slerp(destRotation, i);
      }),
    [destRotation],
  );

  useEffect(() => {
    if (!geometry) return;
    geometry.syncronizeVertex(+!activate);
    if (activate) {
      const newPosition = getCameraFrontPosition(camera, meshRef.current, 5);
      const newRotation = getCameraRotation(camera, meshRef.current);

      setDestPosition(newPosition);
      setDestRotation(newRotation);
    }
  }, [activate]);

  function toggleActivate() {
    return setActivate((prev) => !prev);
  }

  return (
    <animated.mesh
      {...props}
      position={position}
      quaternion={rotation}
      geometry={geometry}
      onClick={toggleActivate}
      ref={meshRef}
    >
      <animated.shaderMaterial {...PixelFragmentShader} uniforms={matUniforms} uniforms-lerp-value={lerp} />
    </animated.mesh>
  );
}
