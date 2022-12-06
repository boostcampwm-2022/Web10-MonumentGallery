import { useState } from "react";

import ShareModal from "./ShareModal";
import HoverButton from "../../../components/buttons/HoverButton";
import FullScreenModal from "../../../components/modal/FullScreenModal";

import userStore from "../../../store/user.store";

import SharedIcon from "../../../assets/images/shared.svg";
import ProtectedIcon from "../../../assets/images/protected.svg";
import ViewsCount from "../ViewsCount";

export default function ShareButton() {
  const [showShareModal, setShowShareModal] = useState(false);

  const isShared = userStore((user) => user.isShared);

  function onClick() {
    setShowShareModal(!showShareModal);
  }

  return (
    <>
      <HoverButton
        className="share"
        img={isShared ? SharedIcon : ProtectedIcon}
        caption={isShared ? "전체에게 공개됨" : "전체에게 비공개됨"}
        onClick={onClick}
      >
        <ViewsCount />
      </HoverButton>
      <FullScreenModal css={{ width: "400px", height: "230px" }} show={showShareModal} setShow={setShowShareModal}>
        <ShareModal onShareButtonClick={() => setShowShareModal(false)} />
      </FullScreenModal>
    </>
  );
}
