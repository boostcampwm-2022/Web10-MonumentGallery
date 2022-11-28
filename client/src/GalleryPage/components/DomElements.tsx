import { useState } from "react";
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

export default function DomElements() {
  const { locked } = lockStore();
  const [hover, setHover] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  function onShareClick() {
    setShowShareModal(!showShareModal);
  }

  return (
    <>
      {!locked && (
        <>
          <FloatLayout>
            <Header>
              <UserInfo />
              <ThemeSeletor />
              <button>
                <img width={24} src={MenuIcon} />
              </button>
            </Header>
            <div className="share">
              <div className="share-hover" hidden={!hover}>
                전체에게 공개
              </div>
              <button
                className="share-button"
                onClick={onShareClick}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <img src={SharedIcon} />
              </button>
            </div>
          </FloatLayout>
          <FullScreenModal width="50%" height="10%" show={showShareModal} setShow={setShowShareModal}>
            <div>공유하기</div>
          </FullScreenModal>
        </>
      )}
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
