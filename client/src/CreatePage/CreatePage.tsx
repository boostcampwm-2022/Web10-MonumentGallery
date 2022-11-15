import React, { useState } from "react";
import FullScreenModal from "../components/modal/FullScreenModal";
import "./style.scss";

export default function CreatePage() {
  const [show, setShow] = useState<boolean>(false);
  function getData() {
    console.log("TEST");
  }
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
        <button type="button" onClick={getData}>
          생성
        </button>
      </FullScreenModal>
    </div>
  );
}
