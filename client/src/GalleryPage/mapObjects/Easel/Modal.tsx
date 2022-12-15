import { Html } from "@react-three/drei";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import { RoadSignGalleryPageHtml } from "../../../components/RoadSign/RoadSignHtml";
import "../../../components/RoadSign/style.scss";
import CloseIcon from "../../../assets/images/close.png";

export default function GalleryGuileModal({ show, setShow }) {
  return (
    <Html
      position={[0.1, 0, -0.1]}
      rotation={[0, Math.PI / 2, 0]}
      transform={false}
      wrapperClass="road-sign-html"
      zIndexRange={[1, 10]}
    >
      <FullScreenModal
        css={{ width: "60%", minWidth: "800px", height: "80%", opacity: "0.9" }}
        show={show}
        setShow={setShow}
      >
        <div className="road-sign-modal" onWheel={(e) => e.stopPropagation()}>
          <RoadSignGalleryPageHtml />
          <button className="sign-modal-close-button" onClick={() => setShow(false)}>
            <img width={15} height={15} src={CloseIcon} alt="closeIcon" />
          </button>
        </div>
      </FullScreenModal>
    </Html>
  );
}
