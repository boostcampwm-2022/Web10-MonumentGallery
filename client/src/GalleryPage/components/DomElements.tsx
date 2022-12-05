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
import toastStore from "../../store/toast.store";
import TOAST from "../../components/Toast/ToastList";
import userStore from "../../store/user.store";
import galleryStore from "../../store/gallery.store";
import axios from "axios";
import { IHistory } from "../../@types/gallery";
import URLCopy from "../../utils/URLCopy";

export default function DomElements({
  setRequestUrl,
}: {
  setRequestUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { locked } = lockStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div hidden={locked}>
        <FloatLayout>
          <Header>
            <UserInfo />
            <ThemeSeletor />
            <button>
              <img width={24} src={HistoryIcon} onClick={() => setShowSidebar(!showSidebar)} />
            </button>
          </Header>
          <SyncButton />
          <ShareButton show={showShareModal} setShow={setShowShareModal} />
        </FloatLayout>
        <FullScreenModal css={{ width: "400px", height: "230px" }} show={showShareModal} setShow={setShowShareModal}>
          <ShareModal onShareButtonClick={() => setShowShareModal(false)} />
        </FullScreenModal>
        <HistorySidebar show={showSidebar} setShow={setShowSidebar} setRequestUrl={setRequestUrl} />
      </div>
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}

function ShareModal({ onShareButtonClick }: { onShareButtonClick: () => void }) {
  const isShared = userStore((store) => store.isShared);
  const setShared = userStore((store) => store.setShared);
  const addToast = toastStore((store) => store.addToast);

  return (
    <div className="modal share-modal">
      <span>{isShared ? "공유를 중단하시겠습니까?" : "공유를 시작하시겠습니까?"}</span>
      <div className="button__container">
        <button
          onClick={() => {
            const toastMsg = isShared ? "공유를 중단합니다." : "공유를 시작합니다.";
            axios
              .post("/api/user/share", { isShared: !isShared })
              .then(() => {
                addToast(TOAST.INFO(toastMsg));
                setShared(!isShared);
                if (isShared) {
                  onShareButtonClick();
                }
              })
              .catch(() => {
                const toastErrMsg = "에러가 발생했습니다.";
                addToast(TOAST.ERROR(toastErrMsg));
              });
          }}
        >
          {isShared ? "공유 중단" : "공유 시작"}
        </button>
        {isShared && (
          <button
            onClick={async () => {
              const result = await URLCopy();
              if (result) {
                const toastMsg = "이 공간의 링크가 클립보드에 복사되었습니다.";
                addToast(TOAST.INFO(toastMsg));
              } else {
                const toastErrMsg = "에러가 발생했습니다.";
                addToast(TOAST.ERROR(toastErrMsg));
              }
              onShareButtonClick();
            }}
          >
            링크 복사하기
          </button>
        )}
      </div>
    </div>
  );
}

function ShareButton({ show, setShow }: { show: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
  const data = galleryStore((gallery) => gallery.data);
  const galleryUserId = galleryStore((gallery) => gallery.userId);
  const isLoggedIn = userStore((user) => user.isLoggedIn);
  const isShared = userStore((user) => user.isShared);
  const id = userStore((user) => user.user?.id);

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
      {isShared && (
        <>
          <span data-views={data.views} className="share-span">
            조회:
          </span>
          <span className="share-span share-view-count">{data.views}</span>
        </>
      )}
    </div>
  );
}

function HistorySidebar({
  show,
  setShow,
  setRequestUrl,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const historyRef = useRef<HTMLDivElement>(null);
  const historyListRef = useRef<HTMLDivElement>(null);

  const [scrollOffset, setScrollOffset] = useState(0);
  const [selected, setSelected] = useState(0);
  const [canScroll, setCanScroll] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [histories, setHistories] = useState<IHistory[]>([]);

  const data = galleryStore((store) => store.data);
  const userId = galleryStore((store) => store.userId);

  useLayoutEffect(() => {
    if (!userId) return;
    axios.get<IHistory[]>(`/api/history/${userId}`).then((res) => {
      if (!res.data) return;
      setHistories(res.data);
      const idx = res.data.findIndex((history) => history.id === data.id);
      setScrollOffset(idx);
      setSelected(idx);
    });
  }, [userId, data]);

  useEffect(() => {
    if (canScroll) return;
    const scrollTimeout = setTimeout(() => {
      setCanScroll(true);
    }, 20);
    return () => clearTimeout(scrollTimeout);
  }, [canScroll]);

  useEffect(() => {
    const offset = Math.abs(selected - scrollOffset);
    if (offset >= 1) {
      if (!historyListRef.current) return;
      setSelected(parseInt("" + scrollOffset));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const height = historyListRef.current.querySelector("div")!.clientHeight - historyListRef.current.clientHeight;
      const length = histories.length - 2;
      const scr = height / length;
      historyListRef.current.scrollTop = -scr + selected * scr;
    }

    const scrollHandler = (e: WheelEvent) => {
      if (!canScroll || Math.abs(e.deltaY) < 10) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (dir < 0 && selected <= 0) return;
      if (dir > 0 && selected >= histories.length - 1) return;
      setScrollOffset(scrollOffset + dir);
      setCanScroll(false);
    };
    historyRef.current?.addEventListener("wheel", scrollHandler);
    return () => historyRef.current?.removeEventListener("wheel", scrollHandler);
  }, [scrollOffset, canScroll]);

  function setGalleryDataFromHistory() {
    const history = histories[selected];
    const url = `/api/gallery/${userId}/${history.id}`;
    setRequestUrl(url);
    setShow(false);
    setShowHistoryModal(false);
  }

  function onHistoryClick(distanceToSelected: number) {
    if (distanceToSelected) {
      const newSelected = selected + distanceToSelected;
      setSelected(newSelected);
      setScrollOffset(newSelected);
      return;
    }
    setShowHistoryModal(true);
  }

  return (
    <div ref={historyRef} className="history-sidebar" style={{ display: show ? "block" : "none" }}>
      <div className="dimmed" onClick={() => setShow(false)} />
      <div ref={historyListRef} className="history-list">
        <div>
          {histories.map((history, i) => (
            <HistoryItem
              key={history.id}
              distanceToSelected={i - selected}
              history={history}
              onClick={onHistoryClick}
            />
          ))}
        </div>
      </div>
      {showHistoryModal && (
        <FullScreenModal
          css={{ width: "300px", height: "200px" }}
          show={showHistoryModal}
          setShow={setShowHistoryModal}
        >
          <div className="modal history-modal">
            <div>
              {histories[selected].id === data.id ? "현재 히스토리 데이터입니다." : "새로운 데이터를 불러옵니다."}
            </div>
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
  const data = galleryStore((store) => store.data);
  const offset = useMemo(() => Math.abs(distanceToSelected), [distanceToSelected]);

  return (
    <div key={history.id} className="history">
      {(hover || !distanceToSelected) && <span className="history-time">{history.time}</span>}
      <span
        style={history.id === data.id ? { backgroundColor: "#ffffff", color: "#222222" } : {}}
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
