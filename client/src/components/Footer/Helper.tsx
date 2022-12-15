import { useState, useEffect } from "react";
import FullScreenModal from "../modal/FullScreenModal";

import type { ReactNode } from "react";
import "./helper.scss";
import HelperIcon from "../../assets/images/help.svg";
import CloseIcon from "../../assets/images/close.png";

interface HelperProps {
  children: ReactNode;
}

interface HelperContentProps {
  children: ReactNode;
  closeModal: () => void;
}

export default function Helper({ children }: HelperProps) {
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    function openModal() {
      setOpened(true);
    }
    document.addEventListener("open-help", openModal);
    return () => document.removeEventListener("open-help", openModal);
  }, []);

  return (
    <>
      <button
        type="button"
        className="footer-element"
        onClick={(e) => {
          setOpened(true);
          e.currentTarget.blur();
        }}
      >
        <img width={24} height={24} src={HelperIcon} alt="help" />
      </button>
      <FullScreenModal
        css={{ width: "60%", minWidth: "800px", height: "80%", opacity: "0.9" }}
        show={opened}
        setShow={setOpened}
      >
        <HelperContent closeModal={() => setOpened(false)}>{children}</HelperContent>
      </FullScreenModal>
    </>
  );
}

function HelperContent({ children, closeModal }: HelperContentProps) {
  return (
    <div className="road-sign-modal" onWheel={(e) => e.stopPropagation()}>
      {children}
      <button className="sign-modal-close-button" onClick={closeModal}>
        <img width={15} height={15} src={CloseIcon} alt="closeIcon" />
      </button>
      <Buttons />
    </div>
  );
}

function Buttons() {
  return (
    <div className="sign-buttons">
      <a
        href="https://boostcamp7-monolith.notion.site/c8719b4dd0324032a134ad08f98a93f6"
        target="_blank"
        rel="noreferrer"
      >
        <button className="sign-html-button">프로젝트 소개 보기</button>
      </a>
      <a
        href="https://boostcamp7-monolith.notion.site/Monument-Gallery-7d1239b321684fed94d4669bcee673f0"
        target="_blank"
        rel="noreferrer"
      >
        <button className="sign-html-button">팀 노션 보기</button>
      </a>
    </div>
  );
}
