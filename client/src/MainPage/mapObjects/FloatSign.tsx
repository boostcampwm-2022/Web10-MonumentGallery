import { useState, useEffect, useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import RoadSign from "./RoadSign";
import mainStore from "../../store/main.store";
import { getCookie, setCookie } from "../../utils/cookie";
import CloseIcon from "../../assets/images/close.png";

import type { Vector3, ThreeEvent } from "@react-three/fiber";

interface CloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function FloatSign() {
  const [move, setMove] = useState(true);
  const [show, setShow] = useState(true);
  const showSplash = mainStore((store) => store.showSplash);
  const offset = [-5, -8, -14];
  const { camera } = useThree();

  const [springs, api] = useSpring(() => ({
    position: [-5, -8, -14],
    config: { mass: 2, tension: 200 },
  }));

  useLayoutEffect(() => {
    setShow(getCookie("mainSign") !== "true");
  }, []);

  useEffect(() => {
    if (!show) return;
    let timeout: NodeJS.Timeout;
    let floating = false;
    const bounce = () => {
      if (!move) return;
      api.start({
        position: [
          camera.position.x + offset[0],
          floating ? camera.position.y + offset[1] + 1.3 : camera.position.y + offset[1],
          camera.position.z + offset[2],
        ],
      });
      floating = !floating;
      timeout = setTimeout(bounce, floating ? 1.2 * 1000 : 0.2 * 1000);
    };
    bounce();
    return () => clearTimeout(timeout);
  }, [move, show]);

  if (!show || showSplash) return null;

  return (
    <animated.group position={springs.position as unknown as Vector3} rotation={[0, -Math.PI / 2, 0]} scale={[2, 2, 2]}>
      <group>
        <RoadSign
          onPointerEnter={() => setMove(false)}
          onPointerLeave={() => setMove(true)}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            document.dispatchEvent(new CustomEvent("open-help"));
          }}
        >
          <CloseButton
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              setCookie({ name: "mainSign", value: "true", maxAge: 60 * 60 * 24 });
              setShow(false);
            }}
          />
        </RoadSign>
      </group>
    </animated.group>
  );
}

function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <Html
      transform={true}
      position={[0.2, 0.6, -1]}
      rotation={[0, Math.PI / 2, 0]}
      occlude
      wrapperClass="road-sign-html"
      zIndexRange={[1, 10]}
    >
      <button className="sign-button" onClick={onClick}>
        <img width={6} height={6} src={CloseIcon} alt="closeIcon" />
      </button>
    </Html>
  );
}
