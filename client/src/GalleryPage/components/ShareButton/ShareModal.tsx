import axios from "axios";

import TOAST from "../../../components/Toast/ToastList";

import userStore from "../../../store/user.store";
import toastStore from "../../../store/toast.store";
import URLCopy from "../../../utils/URLCopy";

import "./ShareModal.scss";

export default function ShareModal({ onShareButtonClick }: { onShareButtonClick: () => void }) {
  const isShared = userStore((store) => store.isShared);
  const setShared = userStore((store) => store.setShared);
  const addToast = toastStore((store) => store.addToast);

  function requestShare() {
    const toastMsg = isShared ? "공유를 중단합니다." : "공유를 시작합니다.";
    axios
      .post("/api/user/share", { isShared: !isShared })
      .then(() => {
        addToast(TOAST.INFO(toastMsg));
        setShared(!isShared);
        if (isShared) onShareButtonClick();
      })
      .catch(() => {
        const toastErrMsg = "에러가 발생했습니다.";
        addToast(TOAST.ERROR(toastErrMsg));
      });
  }

  async function copyLink() {
    const result = await URLCopy();
    if (result) {
      const toastMsg = "이 공간의 링크가 클립보드에 복사되었습니다.";
      addToast(TOAST.INFO(toastMsg));
    } else {
      const toastErrMsg = "에러가 발생했습니다.";
      addToast(TOAST.ERROR(toastErrMsg));
    }
    onShareButtonClick();
  }

  return (
    <div className="modal share-modal">
      <span>{isShared ? "공유를 중단하시겠습니까?" : "공유를 시작하시겠습니까?"}</span>
      <div className="button__container">
        <button onClick={requestShare}>{isShared ? "공유 중단" : "공유 시작"}</button>
        <button className={!isShared ? "hidden" : null} onClick={copyLink}>
          링크 복사하기
        </button>
      </div>
    </div>
  );
}
