/* eslint-disable @typescript-eslint/ban-ts-comment */
import RoadSignGLB from "../../../../assets/models/road-sign.glb?url";

import { Html, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useSpring, animated } from "@react-spring/three";
import { useEffect, useRef, useState } from "react";

import { useThree } from "@react-three/fiber";
import CloseIcon from "../../../../assets/images/close.png";
import FullScreenModal from "../../../../components/modal/FullScreenModal";
import RoadSignHtml from "./RoadSignHtml";
import "./style.scss";

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_8: THREE.Mesh;
  };
  materials: {
    Wood: THREE.MeshStandardMaterial;
    ["WoodLight.001"]: THREE.MeshStandardMaterial;
    ["iron.001"]: THREE.MeshStandardMaterial;
  };
};

export default function RoadSign(
  props: JSX.IntrinsicElements["group"] & { show: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>> },
) {
  const { nodes, materials } = useGLTF(RoadSignGLB) as unknown as GLTFResult;
  const ref = useRef<THREE.Group>(null);
  const [move, setMove] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { camera } = useThree();

  const [springs, api] = useSpring(() => ({
    position: [-0.79, 1.3, 0.62],
    config: { mass: 2, tension: 200 },
  }));

  useEffect(() => {
    if (!props.show) return;
    let timeout: NodeJS.Timeout;
    let floating = false;
    const bounce = () => {
      if (!ref.current || !move) return;
      api.start({
        position: [
          camera.position.x - 3 - 0.79,
          floating ? camera.position.y - 20 + 2.6 : camera.position.y - 20 + 1.3,
          camera.position.z - 15 + 0.62,
        ],
      });
      floating = !floating;
      timeout = setTimeout(bounce, floating ? 1.2 * 1000 : 0.2 * 1000);
    };
    bounce();
    return () => clearTimeout(timeout);
  }, [move, props.show]);

  if (!props.show) return null;

  return (
    // @ts-ignore
    <animated.group ref={ref} {...props} {...springs} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[0.21, 4.91, 0.02]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_6.geometry} material={materials["WoodLight.001"]}>
              <Html
                position={[0.1, 0, -0.1]}
                rotation={[0, Math.PI / 2, 0]}
                transform={!showModal}
                occlude
                zIndexRange={[1, 10]}
              >
                <div
                  className="road-sign"
                  onPointerEnter={() => setMove(false)}
                  onPointerLeave={() => setMove(true)}
                  onClick={() => setShowModal(true)}
                >
                  <div>
                    <span>{showModal ? "" : "모뉴먼트 갤러리"}</span>
                  </div>
                  <div>
                    <span>{showModal ? "" : "서비스 소개 클릭!"}</span>
                  </div>
                  <button
                    className="sign-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.setShow(false);
                    }}
                  >
                    {!showModal && <img width={6} src={CloseIcon} alt="closeIcon" />}
                  </button>
                </div>
                <FullScreenModal css={{ width: "70vw", height: "80vh" }} show={showModal} setShow={setShowModal}>
                  <div className="modal" onWheel={(e) => e.stopPropagation()}>
                    <RoadSignHtml />
                    <button
                      className="sign-modal-close-button"
                      onClick={() => {
                        setShowModal(false);
                        setMove(true);
                      }}
                    >
                      <img width={15} src={CloseIcon} alt="closeIcon" />
                    </button>
                  </div>
                </FullScreenModal>
              </Html>
            </mesh>
          </group>
          <group position={[0.27, 5.36, -0.01]} rotation={[0, 0, -Math.PI / 2]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_8.geometry} material={materials["iron.001"]} />
          </group>
        </group>
      </group>
    </animated.group>
  );
}

useGLTF.preload(RoadSignGLB);
