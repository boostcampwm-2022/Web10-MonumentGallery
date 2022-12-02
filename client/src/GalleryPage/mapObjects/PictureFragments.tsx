import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import { Color, Vector3, Quaternion, Mesh, Camera, Object3D, Group } from "three";
import { useThree, useFrame, MeshProps, GroupProps } from "@react-three/fiber";
// import { Float } from "@react-three/drei";
import { useSpring, animated, Interpolation } from "@react-spring/three";

import PixelFragmentGeometry from "./pixelFragmentGeometry";
import PixelFragmentShader, { pixelFragmentShaderUniforms } from "./pixelFragmentShader";

type IColor = Color | string | number;

interface PictureFragmentsProps extends MeshProps {
  pixels: IColor[][];
  size?: number;
  scatterRadius?: number;
}

interface FloatProps extends GroupProps {
  isPlaying?: boolean;
  children?: ReactNode;
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
    return object.worldToLocal(result);
  }
  return result;
}

function Float({ isPlaying = true, children }: FloatProps = {}) {
  const ref = useRef<Group>(null);
  const offset = useRef(Math.random() * 10000);
  const elapsedTime = useRef(offset.current);

  useFrame((_, delta) => {
    if (!isPlaying || !ref.current) return;
    elapsedTime.current += delta;
    ref.current.rotation.x = Math.cos(elapsedTime.current / 8) * 0.2;
    ref.current.rotation.y = Math.sin(elapsedTime.current / 20) * 0.2;
    ref.current.rotation.z = Math.sin(elapsedTime.current / 8) * 0.2;
    ref.current.position.y = Math.sin(elapsedTime.current / 12);
  });

  return <group ref={ref}>{children}</group>;
}

export default function PictureFragments({ pixels, size = 3, scatterRadius = 8, ...props }: PictureFragmentsProps) {
  const { camera } = useThree();
  const meshRef = useRef<Mesh>(null);
  const worldPosition = useRef<Vector3>(new Vector3());
  const geometry = useMemo(() => new PixelFragmentGeometry(pixels, size, scatterRadius), [pixels, size, scatterRadius]);
  const uniforms = useRef(pixelFragmentShaderUniforms());
  const scatterFragScale = useMemo(() => {
    const max = Math.max(pixels.length, pixels[0].length);
    if (max === 0 || Number.isNaN(max)) return 1;
    return 0.6 * Math.sqrt(max / 8);
  }, [pixels]);

  const [activate, setActivate] = useState(false);
  const [destPosition, setDestPosition] = useState(new Vector3());
  const [destRotation, setDestRotation] = useState(new Quaternion());

  const { spring } = useSpring({ spring: +activate });

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
    if (!geometry || !meshRef.current) return;
    geometry.syncronizeVertex(+!activate);

    if (!activate) return;

    const newPosition = getCameraFrontPosition(camera, meshRef.current, 5);
    const newRotation = getCameraRotation(camera, meshRef.current);

    setDestPosition(newPosition);
    setDestRotation(newRotation);
  }, [activate]);

  useFrame(() => {
    if (!activate) return;

    const zBasis = new Vector3().setFromMatrixColumn(camera.matrix, 2).setLength(-1);
    const worldDestPosition = destPosition.clone();
    if (meshRef.current?.parent) worldDestPosition.applyMatrix4(meshRef.current.parent.matrixWorld);

    const relativePosition = new Vector3().subVectors(worldDestPosition, camera.position);
    if (zBasis.dot(relativePosition) < 0 || relativePosition.length() > scatterRadius * 2) {
      setActivate(false);
    }
  });

  function toggleActivate() {
    if (!meshRef.current) return;

    if (!activate) {
      meshRef.current.getWorldPosition(worldPosition.current);
      if (camera.position.distanceTo(worldPosition.current) >= scatterRadius * 2) return;
    }

    return setActivate((prev) => !prev);
  }

  // why ts + react-spring + react-three/fiber is so messy!
  return (
    <Float isPlaying={!activate}>
      <animated.mesh
        {...props}
        position={position as unknown as Vector3}
        quaternion={rotation as unknown as Quaternion}
        geometry={geometry}
        onClick={toggleActivate}
        ref={meshRef}
      >
        <animated.shaderMaterial
          {...PixelFragmentShader}
          uniforms={uniforms.current}
          uniforms-lerp-value={lerp}
          uniforms-scatterFragScale-value={scatterFragScale}
        />
      </animated.mesh>
    </Float>
  );
}
