import { useState } from "react";
import { IGalleryMapData, THEME } from "../../@types/gallery";
import FullScreenModal from "../../components/modal/FullScreenModal";
import SpaceCreater, { PeriodType } from "../../components/SpaceCreater";
import galleryStore from "../../store/gallery.store";
import SyncButtonIcon from "../../assets/images/sync-button.svg";
import { createResource, Resource } from "../../utils/suspender";
import dummyData from "../dummyData";

interface IOnLoadFunction {
  <T>(a: T): void;
}

export default function SyncButton() {
  const [show, setShow] = useState<boolean>(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const { setData } = galleryStore();

  function showModal() {
    setShow(true);
  }

  function onLoad(data: IGalleryMapData): void {
    setData(data);
    setResource(null);
    setShow(false);
  }
  return (
    <>
      <button onClick={showModal}>
        <img src={SyncButtonIcon}></img>
      </button>
      <FullScreenModal show={show} width="70%" height="55%" setShow={setShow}>
        <SpaceCreater
          resource={resource}
          onSubmit={(period: PeriodType | null, theme: THEME | null) => {
            setResource(createResource({ method: "post", url: "/api/gallery/sync", params: { period, theme } }));
          }}
          onLoad={onLoad as IOnLoadFunction}
          type="sync"
        />
      </FullScreenModal>
    </>
  );
}
