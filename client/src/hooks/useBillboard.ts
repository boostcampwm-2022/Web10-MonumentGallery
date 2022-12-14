import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Matrix4, Quaternion, Euler, Object3D } from "three";

interface LockConfig {
  lockElevation?: boolean;
  follow?: boolean;
}

const _matrix = new Matrix4();
const _euler = new Euler(0, 0, 0, "YXZ");
const _quaternion = new Quaternion();

function getAzimuth(quaternion: Quaternion) {
  _matrix.makeRotationFromQuaternion(quaternion);
  const elem = _matrix.elements;
  const m11 = elem[0],
    m13 = elem[8];
  const m23 = elem[9];
  const m31 = elem[2],
    m33 = elem[10];

  // const x = Math.asin( - Math.min( Math.max(m23, -1), 1 );
  if (Math.abs(m23) < 0.9999999) return Math.atan2(m13, m33);
  else return Math.atan2(-m31, m11);
}

export function useBillboard<T>({ lockElevation = false, follow = true }: LockConfig = {}) {
  const objectRef = useRef<T>(null) as React.RefObject<Object3D<Event>>;
  const { camera } = useThree();

  useFrame(() => {
    if (!follow || !objectRef.current) return;
    const object = objectRef.current;

    _quaternion.copy(camera.quaternion);
    if (lockElevation) {
      _euler.y = getAzimuth(_quaternion);
      _quaternion.setFromEuler(_euler);
    }
    object.quaternion.copy(_quaternion);

    if (object.parent) {
      _matrix.extractRotation(object.parent.matrixWorld);
      _quaternion.setFromRotationMatrix(_matrix);
      object.quaternion.premultiply(_quaternion.invert());
    }
  });

  return objectRef as React.RefObject<T>;
}
