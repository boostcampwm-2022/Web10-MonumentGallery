import "./style.scss";
import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
import React, { Suspense, useEffect } from "react";
import { createResource, Resource } from "../utils/suspender";
import Loading from "./components/Loading";
import galleryStore from "../store/gallery.store";
import useResource from "../hooks/useResource";
import { useParams } from "../hooks/useParams";
import { IGalleryMapData } from "../@types/gallery";
import dummyData from "./dummyData";
import toastStore from "../store/toast.store";
import TOAST from "../components/Toast/ToastList";

export default function GalleryPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="canvas-outer">
          <GalleryLoader resource={createResource()} />
        </div>
        <DomElements />
      </Suspense>
    </>
  );
}

function GalleryLoader({ resource }: { resource: Resource<IGalleryMapData> }) {
  const [user, history] = useParams("gallery", []);
  const { setData } = galleryStore();
  const { addToast } = toastStore();

  function setRequestParams() {
    const END_POINT = "/api/gallery";
    return END_POINT + (user ? `/${user}` : ``) + (history ? `/${history}` : ``);
  }
  const { data } = useResource(resource, { method: "get", url: setRequestParams() });

  useEffect(() => {
    if (data) {
      setData(data);
      return;
    }
    setData(dummyData);
    addToast(TOAST.INFO("데이터가 존재하지 않아 샘플 월드를 랜더링합니다", 5000));
    addToast(TOAST.INFO("WASD 키로 캐릭터를 움직입니다.", 1000 * 60));
    addToast(TOAST.INFO("E 키눌러 마우스로 화면전환을 할 수 있습니다.", 1000 * 60));
    addToast(TOAST.INFO("E 키를 다시 눌러 마우스를 표시합니다.", 1000 * 60));
  }, []);

  return <Gallery />;
}
