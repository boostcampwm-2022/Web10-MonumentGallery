import { Suspense, useState } from "react";
import Header from "../../components/Header";
import { Toast } from "../../components/Toast/Toast";
import FloatLayout from "../../layouts/FloatLayout";
import lockStore from "../../store/lock.store";
import SharedIcon from "../../assets/images/shared.svg";
import ProtectedIcon from "../../assets/images/protected.svg";
import MenuIcon from "../../assets/images/hamburger.svg";
import ThemeSeletor from "../../components/ThemeSelector";
import UserInfo from "../../components/Header/UserInfo";
import FullScreenModal from "../../components/modal/FullScreenModal";
import { CheckLoggedIn } from "../../hooks/useLoggedIn";
import CheckShared from "../../hooks/useShared";
import UserInfoSkeleton from "../../components/Header/UserInfoSkeleton";
import galleryStore from "../../store/gallery.store";

export default function DomElements() {
  const { locked } = lockStore();
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div hidden={locked}>
        <FloatLayout>
          <Header>
            <Suspense fallback={<UserInfoSkeleton />}>
              <CheckLoggedIn />
              <UserInfo />
            </Suspense>
            <ThemeSeletor />
            <button>
              <img width={24} src={MenuIcon} />
            </button>
          </Header>

          <Suspense fallback={<ShareButtonFallback />}>
            <CheckShared />
            <ShareButton show={showShareModal} setShow={setShowShareModal} />
          </Suspense>
        </FloatLayout>
        <FullScreenModal css={{ width: "20%", height: "20%" }} show={showShareModal} setShow={setShowShareModal}>
          <ShareModal />
        </FullScreenModal>
      </div>
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}

function ShareModal() {
  const { isShared } = galleryStore();

  return (
    <div>
      <span>{isShared ? "공유를 중단하시겠습니까?" : "공유를 시작하시겠습니까?"}</span>
    </div>
  );
}

function ShareButtonFallback() {
  return (
    <div className="share">
      <button className="share-button">
        <i />
      </button>
    </div>
  );
}

function ShareButton({ show, setShow }: { show: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { isShared } = galleryStore();
  const [hover, setHover] = useState(false);

  function onShareClick() {
    setShow(!show);
  }

  return (
    <div className="share">
      <div className="share-hover" hidden={!hover}>
        {isShared ? "전체에게 공개됨" : "전체에게 비공개됨"}
      </div>
      <button
        className="share-button"
        onClick={onShareClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {isShared ? <img src={SharedIcon} /> : <img src={ProtectedIcon} />}
      </button>
    </div>
  );
}
