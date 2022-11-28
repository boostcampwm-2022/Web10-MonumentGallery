import { useEffect, useState } from "react";
import { IGalleryMapData, THEME } from "../../@types/gallery";
import FullScreenModal from "../../components/modal/FullScreenModal";
import SpaceCreater, { PeriodType } from "../../components/SpaceCreater";
import galleryStore from "../../store/gallery.store";
import SyncButtonIcon from "../../assets/images/sync-button-icon.png";
import { createResource, Resource } from "../../utils/suspender";
import userStore from "../../store/user.store";
import { useParams } from "../../hooks/useParams";

interface IOnLoadFunction {
  <T>(a: T): void;
}

export default function SyncButton() {
  const [show, setShow] = useState<boolean>(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const { userId, setData } = galleryStore();
  const { user } = userStore();
  // const [targetUserId] = useParams("gallery", []);
  const [isMine, setIsMine] = useState<boolean>(false);
  useEffect(() => {
    const { id } = user;
    console.log(id, userId);
    if (id === userId) {
      setIsMine(true);
    }
  }, [userId]);

  function showModal() {
    setShow(true);
  }
  function onLoad(data: IGalleryMapData): void {
    setData(data, userId ?? "");
    setResource(null);
    setShow(false);
  }
  if (isMine) {
    return (
      <>
        <button className="sync-btn" onClick={showModal}>
          <img src={SyncButtonIcon}></img>
        </button>
        <FullScreenModal show={show} css={{ width: "70%", height: "55%" }} setShow={setShow}>
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
  return null;
}
