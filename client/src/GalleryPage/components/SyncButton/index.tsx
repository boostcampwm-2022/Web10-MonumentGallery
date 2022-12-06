import { useState } from "react";

import SyncSpaceCreater from "./SyncSpaceCreater";
import HoverButton from "../../../components/buttons/HoverButton";
import FullScreenModal from "../../../components/modal/FullScreenModal";

import SyncButtonIcon from "../../../assets/images/sync-button-icon.png";

export default function SyncButton() {
  const [show, setShow] = useState<boolean>(false);

  function showModal() {
    setShow(true);
  }

  return (
    <>
      <HoverButton className="sync" img={SyncButtonIcon} caption="동기화하기" onClick={showModal} />
      <FullScreenModal show={show} css={{ width: "70%", height: "55%", minHeight: "480px" }} setShow={setShow}>
        <SyncSpaceCreater closeModal={() => setShow(false)} />
      </FullScreenModal>
    </>
  );
}
