import "./style.scss";
import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
import React, { Suspense, useEffect, useState } from "react";
import { createResource, Resource } from "../utils/suspender";
import Loading from "./components/Loading";
import galleryStore from "../store/gallery.store";
import { useParams } from "../hooks/useParams";
import { IGalleryMapData } from "../@types/gallery";
import themeStore from "../store/theme.store";
import dummyData from "./dummyData";
import toastStore from "../store/toast.store";
import TOAST from "../components/Toast/ToastList";
import FullScreenModal from "../components/modal/FullScreenModal";

export default function GalleryPage() {
  const [user, history] = useParams("gallery", []);
  function setRequestParams() {
    const END_POINT = "/api/gallery";
    return END_POINT + (user ? `/${user}` : ``) + (history ? `/${history}` : ``);
  }
  return (
    <>
      <Suspense fallback={<Loading text="데이터를 가져오는 중입니다" />}>
        <div className="canvas-outer">
          <GalleryLoader resource={createResource({ method: "get", url: setRequestParams() })} />
        </div>
        <DomElements />
      </Suspense>
    </>
  );
}

function GalleryLoader({ resource }: { resource: Resource<{ gallery: IGalleryMapData; userId: string }> }) {
  const [remainTime, setRemainTime] = useState(5);
  const [useSampleData, setUseSampleData] = useState(false);
  const { setData } = galleryStore();
  const { setTheme } = themeStore();
  const { addToast } = toastStore();

  const { data } = resource.read();
  useEffect(() => {
    if (data) {
      const { gallery, userId } = data;
      setData(gallery, userId);
      setTheme(gallery.theme);
      return;
    }
    if (useSampleData) {
      setData(dummyData, "");
      addToast(TOAST.INFO("데이터가 존재하지 않아 샘플 월드를 랜더링합니다", 5000));
      addToast(TOAST.INFO("WASD 키로 캐릭터를 움직입니다.", 1000 * 60));
      addToast(TOAST.INFO("left shift 및 space로 상하움직임을 제어합니다.", 1000 * 60));
      addToast(TOAST.INFO("E 키눌러 마우스로 화면전환을 할 수 있습니다.", 1000 * 60));
      addToast(TOAST.INFO("E 키를 다시 눌러 마우스를 표시합니다.", 1000 * 60));
    }
  }, [useSampleData]);

  useEffect(() => {
    if (data || useSampleData) return;
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

  if (!data && !useSampleData) {
    return (
      <div>
        <Loading />
        <FullScreenModal show={true} css={{ width: "50%", height: "30%" }}>
          <div className="error-modal">
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
