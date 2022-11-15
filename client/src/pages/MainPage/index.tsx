import React, { useState } from "react";
import FullScreenModal from "../../components/modal/FullScreenModal";
import "./style.scss";

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div>
      <button
        className="upload-btn"
        type="button"
        onClick={() => {
          setShow(true);
        }}
      >
        upload
      </button>
      <FullScreenModal show={show} width="70%" height="55%" setShow={setShow}>
        <button type="button">notion oauth</button>
      </FullScreenModal>
    </div>
  );
}
