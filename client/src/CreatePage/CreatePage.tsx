import { useLayoutEffect, useState } from "react";

import Header from "../components/Header";
import SpaceCreater, { PeriodType } from "../components/SpaceCreater";
import FullScreenModal from "../components/modal/FullScreenModal";
import { Toast } from "../components/Toast/Toast";
import TOAST from "../components/Toast/ToastList";
import FloatLayout from "../layouts/FloatLayout";

import Gallery from "../GalleryPage/Gallery";
import dummyData from "../GalleryPage/dummyData";

import toastStore from "../store/toast.store";
import galleryStore from "../store/gallery.store";

import "./style.scss";
import { THEME } from "../@types/gallery";
import URLCreator from "../utils/URLCreator";

interface IPostGalleryResponse {
  page: string;
}

interface IOnLoadFunction {
  <T>(a: T): void;
}

export default function CreatePage() {
  const [show, setShow] = useState<boolean>(true);
  const [eventSourceUrl, setEventSourceUrl] = useState<string>("");
  const [requested, setRequested] = useState<boolean>(false);
  const { setData } = galleryStore();
  const { addToast } = toastStore();

  useLayoutEffect(() => {
    setData(dummyData, "");
    addToast(TOAST.INFO("데이터를 처리하는 동안 샘플 월드를 랜더링합니다", 5000));
    addToast(TOAST.INFO("WASD 키로 캐릭터를 움직입니다.", 1000 * 60));
    addToast(TOAST.INFO("left shift 및 space로 상하움직임을 제어합니다.", 1000 * 60));
    addToast(TOAST.INFO("E 키를 눌러 마우스로 화면전환을 할 수 있습니다.", 1000 * 60));
    addToast(TOAST.INFO("E 키를 다시 눌러 마우스를 표시합니다.", 1000 * 60));
  }, []);

  function showModal() {
    setShow(true);
  }

  function onLoad({ page }: IPostGalleryResponse): void {
    window.location.href = page;
  }

  return (
    <>
      <div className="canvas-outer">
        <Gallery />
      </div>
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
      <FloatLayout>
        <Header />
        <button className="upload-btn" type="button" onClick={showModal}>
          Upload
        </button>
      </FloatLayout>
      <FullScreenModal show={show} css={{ width: "70%", height: "55%", minHeight: "480px" }} setShow={setShow}>
        <SpaceCreater
          eventSourceUrl={eventSourceUrl}
          onSubmit={(period: PeriodType | null, theme: THEME | null) => {
            const eventSourceUrl = URLCreator({
              path: "/api/gallery/create",
              params: { period: period, theme: theme },
            });
            setEventSourceUrl(eventSourceUrl);
          }}
          onLoad={onLoad as IOnLoadFunction}
          requested={requested}
          setRequested={setRequested}
        />
      </FullScreenModal>
    </>
  );
}
