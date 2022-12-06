import "./style.scss";
import { Suspense, useState } from "react";

import MainCanvas from "./MainCanvas";
import CreateModal from "./components/CreateModal";
import CanvasLoading from "../components/CanvasLoading";
import Header from "../components/Header";
import UserInfo from "../components/Header/UserInfo";
import FullScreenModal from "../components/modal/FullScreenModal";
import Footer from "../components/Footer";

import userStore from "../store/user.store";
import FloatLayout from "../layouts/FloatLayout";

function CreateMonumentButton({ showModal }: { showModal: () => void }) {
  const isLoggedIn = userStore((store) => store.isLoggedIn);

  return (
    <button className={isLoggedIn ? "my-monument-btn" : "upload-btn"} type="button" onClick={showModal}>
      {isLoggedIn ? "My Monument" : "Upload"}
    </button>
  );
}

export default function MainPage() {
  const [show, setShow] = useState<boolean>(false);

  function showModal() {
    setShow(true);
  }

  return (
    <>
      <div className="canvas-outer">
        <Suspense fallback={<CanvasLoading />}>
          <MainCanvas />
        </Suspense>
      </div>
      <FloatLayout>
        <Header>
          <UserInfo />
        </Header>
        <CreateMonumentButton showModal={showModal} />
        <Footer />
      </FloatLayout>
      <FullScreenModal show={show} css={{ width: "70%", height: "55%" }} setShow={setShow}>
        <CreateModal />
      </FullScreenModal>
    </>
  );
}
