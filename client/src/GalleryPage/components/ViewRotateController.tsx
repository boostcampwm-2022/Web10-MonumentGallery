import { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Euler, Vector2, MathUtils, Camera } from "three";
import lockStore from "../../store/lock.store";

interface ViewRotateControlerProps {
  camera?: Camera;
  dom?: HTMLElement;
  toggleKey?: string;
  speed?: number;
}

function useMouseHold(dom: HTMLElement) {
  const [isMouseHold, setMouseHold] = useState<boolean>(false);

  useEffect(() => {
    function handleMouseStart() {
      setMouseHold(true);
    }
    function handleMouseEnd() {
      setMouseHold(false);
    }
    dom.addEventListener("mousedown", handleMouseStart);
    document.addEventListener("mouseup", handleMouseEnd);
    document.addEventListener("mouseleave", handleMouseEnd);
    return () => {
      dom.removeEventListener("mousedown", handleMouseStart);
      document.removeEventListener("mouseup", handleMouseEnd);
      document.removeEventListener("mouseleave", handleMouseEnd);
    };
  }, []);

  return isMouseHold;
}

function ViewRotateControler({ camera, dom, toggleKey = "KeyE", speed = 0.002 }: ViewRotateControlerProps) {
  const { camera: defaultCamera, gl, get, setEvents } = useThree();
  const targetDom = dom || gl.domElement;
  const targetCamera = camera || defaultCamera;
  const _document = targetDom.ownerDocument;
  const { locked, setLocked } = lockStore();
  const isDragging = useMouseHold(targetDom);
  const speedVector = useRef(new Vector2());
  const eulerAngle = useRef(new Euler(0, 0, 0, "YXZ").setFromQuaternion(targetCamera.quaternion));

  function rotateCamera(dx: number, dy: number, isLocked: boolean) {
    const sign = isLocked ? -1 : 1;
    if (isLocked && (Math.abs(dx) > 100 || Math.abs(dy) > 100)) {
      dx = speedVector.current.x;
      dy = speedVector.current.y;
    }
    eulerAngle.current.y += sign * dx * speed;
    eulerAngle.current.x += sign * dy * speed;
    eulerAngle.current.x = MathUtils.clamp(eulerAngle.current.x, MathUtils.degToRad(-85), MathUtils.degToRad(85));
    targetCamera.quaternion.setFromEuler(eulerAngle.current);
    speedVector.current.set(dx, dy);
  }

  useEffect(() => {
    function togglePointerLock() {
      if (!locked) targetDom.requestPointerLock();
      else _document.exitPointerLock();
    }

    function handleKey(e: KeyboardEvent) {
      if (e.code === toggleKey) togglePointerLock();
    }
    function handlePointerLock() {
      setLocked(_document.pointerLockElement === targetDom);
    }

    _document.addEventListener("keyup", handleKey);
    _document.addEventListener("pointerlockchange", handlePointerLock);
    return () => {
      _document.removeEventListener("keyup", handleKey);
      _document.removeEventListener("pointerlockchange", handlePointerLock);
    };
  }, [locked]);

  useEffect(() => {
    if (!locked) return;
    const prevCompute = get().events.compute;
    setEvents({
      compute: (_, state) => {
        state.pointer.set(0, 0);
        state.raycaster.setFromCamera(state.pointer, state.camera);
      },
    });

    return () => {
      setEvents({ compute: prevCompute });
    };
  }, [locked]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (locked) {
        rotateCamera(e.movementX, e.movementY, true);
      } else if (isDragging) {
        rotateCamera(e.movementX, e.movementY, false);
      }
    }

    targetDom.addEventListener("mousemove", handleMouseMove);
    return () => {
      targetDom.removeEventListener("mousemove", handleMouseMove);
    };
  }, [locked, isDragging]);

  return <primitive object={{}} />;
}

export default ViewRotateControler;
