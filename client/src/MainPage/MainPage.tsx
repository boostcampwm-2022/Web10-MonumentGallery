import "./style.scss";
import { Suspense, useState } from "react";

import MainCanvas from "./MainCanvas";
import CreateModal from "./components/CreateModal/CreateModal";
import Header from "../components/Header";
import UserInfo from "../components/Header/UserInfo";
import FullScreenModal from "../components/modal/FullScreenModal";
import Footer from "../components/Footer";
import { Toast } from "../components/Toast/Toast";
import TOAST from "../components/Toast/ToastList";
import Splash from "./components/SplashScreen/SplashScreen";
import ThemeSeletor from "../components/ThemeSelector";

import useError from "../hooks/useError";
import userStore from "../store/user.store";
import toastStore from "../store/toast.store";
import mainStore from "../store/main.store";
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
  const addToast = toastStore((store) => store.addToast);
  const setShowSplash = mainStore((store) => store.setShowSplash);

  useError((reason) => {
    addToast(TOAST.ERROR(reason));
    setShowSplash(false);
  });

  function showModal() {
    setShow(true);
  }

  return (
    <>
      <Splash />
      <div className="canvas-outer">
        <Suspense fallback={null}>
          <MainCanvas />
        </Suspense>
      </div>
      <FloatLayout>
        <Header>
          <UserInfo />
          <ThemeSeletor />
        </Header>
        <CreateMonumentButton showModal={showModal} />
        <Footer />
      </FloatLayout>
      <FullScreenModal show={show} css={{ width: "70%", height: "55%" }} setShow={setShow}>
        <CreateModal />
      </FullScreenModal>
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
