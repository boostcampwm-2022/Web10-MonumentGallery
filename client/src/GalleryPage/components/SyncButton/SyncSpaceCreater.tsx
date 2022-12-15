import { useState } from "react";

import SpaceCreater from "../../../components/SpaceCreater";
import TOAST from "../../../components/Toast/ToastList";

import { useGalleryHistorySave } from "../../../hooks/useGalleryHistorySave";
import galleryStore from "../../../store/gallery.store";
import toastStore from "../../../store/toast.store";
import URLCreator from "../../../utils/URLCreator";

import "./style.scss";

import type { IGalleryMapData, PeriodType, ThemeType } from "../../../@types/gallery";

interface IOnLoadFunction {
  <T>(a: T): void;
}
interface IOnLoadFunctionParams {
  data: IGalleryMapData;
  page: string;
}
interface SyncSpaceCreaterProps {
  closeModal: () => void;
}

export default function SyncSpaceCreater({ closeModal }: SyncSpaceCreaterProps) {
  const [eventSourceUrl, setEventSourceUrl] = useState<string>("");
  const [requested, setRequested] = useState<boolean>(false);

  const galleryUserId = galleryStore((store) => store.userId);
  const { applyGallery } = useGalleryHistorySave();
  const addToast = toastStore((store) => store.addToast);

  function onLoad({ data, page }: IOnLoadFunctionParams): void {
    applyGallery(data, galleryUserId ?? "", page);
    setRequested(false);
    closeModal();
    const toastMsg = "동기화가 완료되었습니다.";
    addToast(TOAST.INFO(toastMsg));
  }

  return (
    <SpaceCreater
      eventSourceUrl={eventSourceUrl}
      onSubmit={(period: PeriodType | null, theme: ThemeType | null) => {
        const eventSourceUrl = URLCreator({
          path: "/api/gallery/sync",
          params: { period: period, theme: theme },
        });
        setEventSourceUrl(eventSourceUrl);
      }}
      onLoad={onLoad as IOnLoadFunction}
      requested={requested}
      setRequested={setRequested}
      type="sync"
    />
  );
}
