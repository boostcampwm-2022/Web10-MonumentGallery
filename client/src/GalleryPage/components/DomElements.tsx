import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header";
import { Toast } from "../../components/Toast/Toast";
import FloatLayout from "../../layouts/FloatLayout";
import SyncButton from "./SyncButton";
import lockStore from "../../store/lock.store";
import HistoryIcon from "../../assets/images/hamburger.svg";
import SharedIcon from "../../assets/images/shared.svg";
import ProtectedIcon from "../../assets/images/protected.svg";
import ThemeSeletor from "../../components/ThemeSelector";
import UserInfo from "../../components/Header/UserInfo";
import FullScreenModal from "../../components/modal/FullScreenModal";
import { CheckLoggedIn } from "../../hooks/useLoggedIn";
import UserInfoSkeleton from "../../components/Header/UserInfoSkeleton";
import toastStore from "../../store/toast.store";
import TOAST from "../../components/Toast/ToastList";
import userStore from "../../store/user.store";
import galleryStore from "../../store/gallery.store";
import axios from "axios";
import { IGalleryDataResponse, IHistory } from "../../@types/gallery";
import { dummyHistory } from "../dummyHistory";

export default function DomElements() {
  const { locked } = lockStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

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
              <img width={24} src={HistoryIcon} onClick={() => setShowSidebar(!showSidebar)} />
            </button>
          </Header>
          <SyncButton />
          <ShareButton show={showShareModal} setShow={setShowShareModal} />
        </FloatLayout>
        <FullScreenModal css={{ width: "230px", height: "130px" }} show={showShareModal} setShow={setShowShareModal}>
          <ShareModal onShareButtonClick={() => setShowShareModal(false)} />
        </FullScreenModal>
        <HistorySidebar show={showSidebar} />
      </div>
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}

function ShareModal({ onShareButtonClick }: { onShareButtonClick: () => void }) {
  const { isShared, setShared } = userStore();
  const { addToast } = toastStore();

  return (
    <div className="modal share-modal">
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

function HistorySidebar({ show }: { show: boolean }) {
  const historyRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(4);
  const [selected, setSelectd] = useState(4);
  const [canScroll, setCanScroll] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { userId, setData } = galleryStore();
  const [histories, setHistories] = useState<IHistory[]>([]);

  useLayoutEffect(() => {
    setHistories(dummyHistory);
  }, []);

  useEffect(() => {
    const offset = Math.abs(selected - scrollOffset);
    if (offset >= 1) {
      setSelectd(parseInt("" + scrollOffset));
    }

    const scrollTimeout = setTimeout(() => {
      setCanScroll(true);
    }, 20);

    const scrollHandler = (e: WheelEvent) => {
      if (!canScroll || Math.abs(e.deltaY) < 10) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (dir < 0 && selected <= 0) return;
      if (dir > 0 && selected >= histories.length - 1) return;
      setScrollOffset(scrollOffset + dir);
      setCanScroll(false);
      scrollTimeout;
    };
    historyRef.current?.addEventListener("wheel", scrollHandler);
    return () => {
      historyRef.current?.removeEventListener("wheel", scrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [scrollOffset, canScroll]);

  function setGalleryDataFromHistory() {
    const history = histories[selected];
    // const url = `/api/gallery/${userId}/${history.id}`;
    const url = `/api/gallery/${userId}/6384d02539dfa7ebffef6f7e`;
    axios.get<IGalleryDataResponse>(url).then((res) => {
      const { gallery, userId } = res.data;
      setData(gallery, userId);
    });
  }

  function onHistoryClick(distanceToSelected: number) {
    if (distanceToSelected) {
      const newSelected = selected + distanceToSelected;
      setSelectd(newSelected);
      setScrollOffset(newSelected);
      return;
    }
    setShowHistoryModal(true);
  }

  return (
    <div ref={historyRef} className="history-sidebar" style={{ display: show ? "block" : "none" }}>
      <div className="dimmed" />
      <div className="history-list">
        {histories.map((history, i) => (
          <HistoryItem key={history.id} distanceToSelected={i - selected} history={history} onClick={onHistoryClick} />
        ))}
      </div>
      {showHistoryModal && (
        <FullScreenModal css={{ width: "20%", height: "20%" }} show={showHistoryModal} setShow={setShowHistoryModal}>
          <div className="modal history-modal">
            <div>새로운 데이터를 불러옵니다.</div>
            <div className="history-modal-data">
              <span>
                {histories[selected].date} - {histories[selected].time}
              </span>
              <br />
              <span>{histories[selected].id}</span>
            </div>
            <div className="history-modal-buttons">
              <button className="history-get-button" onClick={() => setGalleryDataFromHistory()}>
                불러오기
              </button>
              <button className="history-cancel-button" onClick={() => setShowHistoryModal(false)}>
                취소
              </button>
            </div>
          </div>
        </FullScreenModal>
      )}
    </div>
  );
}

function HistoryItem({
  distanceToSelected,
  history,
  onClick,
}: {
  distanceToSelected: number;
  history: IHistory;
  onClick: (distanceToSelected: number) => void;
}) {
  const [hover, setHover] = useState(false);
  const offset = useMemo(() => Math.abs(distanceToSelected), [distanceToSelected]);
  return (
    <div key={history.id}>
      {(hover || !distanceToSelected) && <span className="history-time">{history.time}</span>}
      <span
        className={`history-item history-item-${offset <= 4 ? offset : "plain"}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => onClick(distanceToSelected)}
      >
        {history.date}
      </span>
    </div>
  );
}
