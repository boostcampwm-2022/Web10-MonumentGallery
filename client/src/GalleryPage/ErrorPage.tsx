import { Suspense, useEffect, useState } from "react";
import FullScreenModal from "../components/modal/FullScreenModal";
import TOAST from "../components/Toast/ToastList";
import { useGalleryHistorySave } from "../hooks/useGalleryHistorySave";
import toastStore from "../store/toast.store";
import Loading from "../components/CanvasLoading";
import dummyData from "./dummyData";
import Gallery from "./Gallery";

export default function ErrorPage() {
  const { applyGallery } = useGalleryHistorySave();
  const [useSampleData, setUseSampleData] = useState(false);
  const [remainTime, setRemainTime] = useState(500);
  const addToast = toastStore((store) => store.addToast);

  useEffect(() => {
    if (!useSampleData) return;

    applyGallery(dummyData, "");
    addToast(TOAST.INFO("데이터가 존재하지 않아 샘플 월드를 랜더링합니다", 5000));
    addToast(TOAST.INFO("WASD 키로 캐릭터를 움직입니다.", 1000 * 10));
    addToast(TOAST.INFO("left shift 및 space로 상하움직임을 제어합니다.", 1000 * 10));
    addToast(TOAST.INFO("E 키눌러 마우스로 화면전환을 할 수 있습니다.", 1000 * 10));
    addToast(TOAST.INFO("E 키를 다시 눌러 마우스를 표시합니다.", 1000 * 10));
  }, [useSampleData]);

  useEffect(() => {
    if (useSampleData) return;
    if (remainTime <= 0) {
      window.location.href = "/";
    }
    const timeout = setTimeout(() => {
      setRemainTime(remainTime - 1);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [remainTime, useSampleData]);

  if (!useSampleData) {
    return (
      <div>
        <Loading />
        <FullScreenModal show={true} css={{ width: "50%", height: "30%" }}>
          <div className="modal error-modal">
            <span className="error-span">메인화면으로 돌아갑니다 ... {remainTime}</span>
            <button className="enter-sample-world-button" onClick={() => setUseSampleData(true)}>
              샘플 월드로 입장하기
            </button>
          </div>
        </FullScreenModal>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Gallery />
    </Suspense>
  );
}
