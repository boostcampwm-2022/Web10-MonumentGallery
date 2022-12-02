import React, { Suspense, useEffect, useMemo, useState } from "react";

import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
import Loading from "./components/Loading";
import FullScreenModal from "../components/modal/FullScreenModal";
import TOAST from "../components/Toast/ToastList";

import { useParams } from "../hooks/useParams";
import { useGalleryHistorySave } from "../hooks/useGalleryHistorySave";
import toastStore from "../store/toast.store";

import { createResource, Resource } from "../utils/suspender";

import { IGalleryDataResponse } from "../@types/gallery";
import dummyData from "./dummyData";
import "./style.scss";

export default function GalleryPage() {
  const [user, history] = useParams("gallery", []);

  const requestUrl = useMemo(() => getRequestUrl(), []);
  const [resource, setResource] = useState({ method: "get", url: requestUrl });

  function getRequestUrl() {
    const END_POINT = "/api/gallery";
    return END_POINT + (user ? `/${user}` : ``) + (history ? `/${history}` : ``);
  }
  return (
    <Suspense fallback={<Loading text="데이터를 가져오는 중입니다" />}>
      <div className="canvas-outer">
        <GalleryLoader resource={createResource(resource)} />
      </div>
      <DomElements setResource={setResource} />
    </Suspense>
  );
}

function GalleryLoader({ resource }: { resource: Resource<IGalleryDataResponse> }) {
  const [remainTime, setRemainTime] = useState(5);
  const [useSampleData, setUseSampleData] = useState(false);
  const [isInitialized, setInitialize] = useState(false);
  const { applyGallery, initializeGallery } = useGalleryHistorySave();
  const { addToast, removeToast } = toastStore();

  const { data, error } = resource.read();

  // 데이터가 존재할 때 실제 데이터 적용
  useEffect(() => {
    if (!data) return;

    const { gallery, userId, page } = data;
    if (!isInitialized) {
      initializeGallery(gallery, userId);
      setInitialize(true);
    } else applyGallery(gallery, userId, page);
  }, [data]);

  // 데이터가 존재하지 않을 때 샘플 데이터 적용
  useEffect(() => {
    if (data || !useSampleData) return;

    applyGallery(dummyData, "");
    addToast(TOAST.INFO("데이터가 존재하지 않아 샘플 월드를 랜더링합니다", 5000));
    addToast(TOAST.INFO("WASD 키로 캐릭터를 움직입니다.", 1000 * 10));
    addToast(TOAST.INFO("left shift 및 space로 상하움직임을 제어합니다.", 1000 * 10));
    addToast(TOAST.INFO("E 키눌러 마우스로 화면전환을 할 수 있습니다.", 1000 * 10));
    addToast(TOAST.INFO("E 키를 다시 눌러 마우스를 표시합니다.", 1000 * 10));
  }, [data === null && useSampleData]);

  // 데이터를 불러오지 못했을 때 타임아웃 메시지 띄우기
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

  // 데이터를 불러오지 못했을 때 에러 메시지 띄우기
  useEffect(() => {
    if (!error) return;
    const errorToast = TOAST.ERROR(error.message);
    addToast(errorToast);
    return () => removeToast(errorToast);
  }, [error]);

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

  if (!data && !useSampleData) {
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
