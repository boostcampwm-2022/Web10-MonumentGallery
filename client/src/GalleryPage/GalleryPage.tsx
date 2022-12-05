import { Suspense, useEffect, useState } from "react";

import Gallery from "./Gallery";
import ErrorPage from "./ErrorPage";
import DomElements from "./components/DomElements";
import Loading from "./components/Loading";
import ErrorBoundary from "../components/common/ErrorBoundary";
import TOAST from "../components/Toast/ToastList";

import { useParams } from "../hooks/useParams";
import { useGalleryHistorySave } from "../hooks/useGalleryHistorySave";

import "./style.scss";
import galleryStore from "../store/gallery.store";
import toastStore from "../store/toast.store";
import { GalleryLoadErrorEvent } from "../@types/gallery";

export default function GalleryPage() {
  const [user, history] = useParams("gallery", []);
  const [requestUrl, setRequestUrl] = useState(getRequestUrl());
  const { addToast } = toastStore();

  function getRequestUrl() {
    const END_POINT = "/api/gallery";
    return END_POINT + (user ? `/${user}` : ``) + (history ? `/${history}` : ``);
  }

  useEffect(() => {
    function errorHandler(e: GalleryLoadErrorEvent) {
      if (!e.detail?.response) return;
      const { reason } = e.detail.response.data;
      addToast(TOAST.ERROR(reason));
      console.log(reason);
    }
    document.addEventListener("error-reason", errorHandler);
    return () => document.removeEventListener("error-reason", errorHandler);
  }, []);

  return (
    <>
      <div className="canvas-outer">
        <ErrorBoundary fallback={<ErrorPage />}>
          <Suspense fallback={<Loading text="데이터를 가져오는 중입니다" />}>
            <GalleryLoader url={requestUrl} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <DomElements setRequestUrl={setRequestUrl} />
    </>
  );
}

function GalleryLoader({ url }: { url: string }) {
  const [isInitialized, setInitialize] = useState(false);
  const { applyGallery, initializeGallery } = useGalleryHistorySave();
  const { getData } = galleryStore();

  const data = getData(url);

  useEffect(() => {
    const { gallery, userId, page } = data;
    if (!isInitialized) {
      initializeGallery(gallery, userId);
      setInitialize(true);
    } else applyGallery(gallery, userId, page);
  }, [data]);

  // 뒤로가기, 앞으로가기 이벤트 바인딩
  useEffect(() => {
    // popstateevent
    function popState(e: PopStateEvent) {
      if (e.state && e.state.data !== undefined && e.state.userId !== undefined) {
        applyGallery(e.state.data, e.state.userId);
      }
    }
    window.addEventListener("popstate", popState);
    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Gallery />
    </Suspense>
  );
}
