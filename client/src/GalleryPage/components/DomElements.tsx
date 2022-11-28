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
import toastStore from "../../store/toast.store";
import TOAST from "../../components/Toast/ToastList";
import userStore from "../../store/user.store";
import galleryStore from "../../store/gallery.store";
import axios from "axios";

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
        <FullScreenModal css={{ width: "230px", height: "130px" }} show={showShareModal} setShow={setShowShareModal}>
          <ShareModal onShareButtonClick={() => setShowShareModal(false)} />
        </FullScreenModal>
      </div>
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}

function ShareModal({ onShareButtonClick }: { onShareButtonClick: () => void }) {
  const { isShared, setShared } = userStore();
  const { addToast } = toastStore();

  return (
    <div className="share-modal">
      <span>{isShared ? "공유를 중단하시겠습니까?" : "공유를 시작하시겠습니까?"}</span>
      <button
        onClick={() => {
          console.log(isShared);
          const toastMsg = isShared ? "공유를 중단합니다." : "공유를 시작합니다.";
          axios.post("/api/user/share", { isShared: !isShared }).then(() => {
            addToast(TOAST.INFO(toastMsg));
            setShared(!isShared);
          });
          onShareButtonClick();
        }}
      >
        {isShared ? "공유 중단" : "공유 시작"}
      </button>
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
  const { userId: galleryUserId } = galleryStore();
  const {
    isLoggedIn,
    isShared,
    user: { id },
  } = userStore();
  const [hover, setHover] = useState(false);

  function onClick() {
    setShow(!show);
  }

  if (!isLoggedIn || id !== galleryUserId) return null;

  return (
    <div className="share">
      <div className="share-hover" hidden={!hover}>
        {isShared ? "전체에게 공개됨" : "전체에게 비공개됨"}
      </div>
      <button
        className="share-button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {isShared ? <img src={SharedIcon} /> : <img src={ProtectedIcon} />}
      </button>
    </div>
  );
}
