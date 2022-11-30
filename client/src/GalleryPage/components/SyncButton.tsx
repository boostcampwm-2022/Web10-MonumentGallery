import { useEffect, useState } from "react";
import { IGalleryMapData, THEME } from "../../@types/gallery";
import FullScreenModal from "../../components/modal/FullScreenModal";
import SpaceCreater, { PeriodType } from "../../components/SpaceCreater";
import galleryStore from "../../store/gallery.store";
import SyncButtonIcon from "../../assets/images/sync-button-icon.png";
import URLCreator from "../../utils/URLCreator";
import userStore from "../../store/user.store";
import toastStore from "../../store/toast.store";
import TOAST from "../../components/Toast/ToastList";

interface IOnLoadFunction {
  <T>(a: T): void;
}
interface IOnLoadFunctionParams {
  data: IGalleryMapData;
  page: string;
}

export default function SyncButton() {
  const [show, setShow] = useState<boolean>(false);
  const [eventSourceUrl, setEventSourceUrl] = useState<string>("");
  const [requested, setRequested] = useState<boolean>(false);
  const { userId, setData } = galleryStore();
  const { user } = userStore();
  const [isMine, setIsMine] = useState<boolean>(false);
  const [hover, setHover] = useState(false);
  const { addToast } = toastStore();

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
  function onLoad({ data, page }: IOnLoadFunctionParams): void {
    setData(data, userId ?? "");
    history.replaceState(null, "", page);
    setRequested(false);
    setShow(false);
    const toastMsg = "동기화가 완료되었습니다.";
    addToast(TOAST.INFO(toastMsg));
  }
  if (isMine) {
    return (
      <>
        <div className="sync">
          <div className="sync-hover" hidden={!hover}>
            동기화하기
          </div>
          <button
            className="sync-button"
            onClick={showModal}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <img src={SyncButtonIcon}></img>
          </button>
        </div>

        <FullScreenModal show={show} css={{ width: "70%", height: "55%", minHeight: "480px" }} setShow={setShow}>
          <SpaceCreater
            eventSourceUrl={eventSourceUrl}
            onSubmit={(period: PeriodType | null, theme: THEME | null) => {
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
        </FullScreenModal>
      </>
    );
  }
  return null;
}
