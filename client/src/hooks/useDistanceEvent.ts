import { Object3D } from "three";
import { useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";

interface Rectangle {
  type: "rect";
  x: number;
  z: number;
  width: number;
  height: number;
}

interface Circle {
  type: "circle";
  x: number;
  z: number;
  radius: number;
}

interface DistanceEventProps {
  area: Rectangle | Circle;
  enterEvent?: () => void;
  exitEvent?: () => void;
  target?: Object3D;
}

function checkPointAreaIntersect(point: { x: number; z: number }, area: Rectangle | Circle): boolean {
  if (area.type === "circle") {
    return Math.hypot(area.x - point.x, area.z - point.z) <= area.radius;
  }
  if (area.type === "rect") {
    const between = (value: number, min: number, max: number) => min <= value && value <= max;
    return (
      between(point.x, area.x - area.width / 2, area.x + area.width / 2) &&
      between(point.z, area.z - area.height / 2, area.z + area.height / 2)
    );
  }
  throw new TypeError("area가 원형이나 사각형이 아닙니다!");
}

export function useDistanceEvent({ area, enterEvent, exitEvent, target }: DistanceEventProps) {
  function getTarget(): Object3D {
    if (target) return target;
    const { camera } = useThree();
    return camera;
  }

  const targetPointer = getTarget();
  const { x, z } = targetPointer.position;
  const [isInside, setInside] = useState<boolean>(checkPointAreaIntersect({ x, z }, area));

  useEffect(() => {
    if (isInside && enterEvent) enterEvent();
    else if (!isInside && exitEvent) exitEvent();
  }, [isInside]);

  useFrame(() => {
    const { x, z } = targetPointer.position;
    const intersected = checkPointAreaIntersect({ x, z }, area);
    if (isInside !== intersected) setInside(intersected);
  });
}
