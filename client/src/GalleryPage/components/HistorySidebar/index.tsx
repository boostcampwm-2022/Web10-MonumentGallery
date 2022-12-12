import { useState, useRef, useLayoutEffect, useEffect } from "react";
import axios from "axios";

import HistoryItem from "./HistoryItem";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import galleryStore from "../../../store/gallery.store";
import "./style.scss";

import type { Dispatch, SetStateAction } from "react";
import type { IHistory } from "../../../@types/gallery";

interface HistorySidebarProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  setRequestUrl: Dispatch<SetStateAction<string>>;
}

export default function HistorySidebar({ show, setShow, setRequestUrl }: HistorySidebarProps) {
  const historyRef = useRef<HTMLDivElement>(null);
  const historyListRef = useRef<HTMLDivElement>(null);

  const [scrollOffset, setScrollOffset] = useState(0);
  const [selected, setSelected] = useState(0);
  const [canScroll, setCanScroll] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [histories, setHistories] = useState<IHistory[]>([]);

  const data = galleryStore((store) => store.data);
  const userId = galleryStore((store) => store.userId);

  useLayoutEffect(() => {
    if (!userId) return;
    axios.get<IHistory[]>(`/api/history/${userId}`).then((res) => {
      if (!res.data) return;
      setHistories(res.data);
      const idx = res.data.findIndex((history) => history.id === data.id);
      setScrollOffset(idx);
      setSelected(idx);
    });
  }, [userId, data]);

  useEffect(() => {
    if (canScroll) return;
    const scrollTimeout = setTimeout(() => {
      setCanScroll(true);
    }, 20);
    return () => clearTimeout(scrollTimeout);
  }, [canScroll]);

  useEffect(() => {
    const offset = Math.abs(selected - scrollOffset);
    if (offset >= 1) {
      if (!historyListRef.current) return;
      setSelected(parseInt("" + scrollOffset));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const height = historyListRef.current.querySelector("div")!.clientHeight - historyListRef.current.clientHeight;
      const length = histories.length - 2;
      const scr = height / length;
      historyListRef.current.scrollTop = -scr + selected * scr;
    }

    const scrollHandler = (e: WheelEvent) => {
      if (!canScroll || Math.abs(e.deltaY) < 10) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (dir < 0 && selected <= 0) return;
      if (dir > 0 && selected >= histories.length - 1) return;
      setScrollOffset(scrollOffset + dir);
      setCanScroll(false);
    };
    historyRef.current?.addEventListener("wheel", scrollHandler);
    return () => historyRef.current?.removeEventListener("wheel", scrollHandler);
  }, [scrollOffset, canScroll]);

  function setGalleryDataFromHistory() {
    const history = histories[selected];
    const url = `/api/gallery/${userId}/${history.id}`;
    setRequestUrl(url);
    setShow(false);
    setShowHistoryModal(false);
  }

  function onHistoryClick(distanceToSelected: number) {
    if (distanceToSelected) {
      const newSelected = selected + distanceToSelected;
      setSelected(newSelected);
      setScrollOffset(newSelected);
    }
    setShowHistoryModal(true);
  }

  return (
    <div ref={historyRef} className="history-sidebar" style={{ display: show ? "block" : "none" }}>
      <div className="dimmed" onClick={() => setShow(false)} />
      <div ref={historyListRef} className="history-list">
        <div>
          {histories.map((history, i) => (
            <HistoryItem
              key={history.id}
              distanceToSelected={i - selected}
              history={history}
              onClick={onHistoryClick}
            />
          ))}
        </div>
      </div>
      <FullScreenModal css={{ width: "300px", height: "200px" }} show={showHistoryModal} setShow={setShowHistoryModal}>
        <div className="modal history-modal">
          <div>
            {histories[selected]?.id === data.id ? "현재 히스토리 데이터입니다." : "새로운 데이터를 불러옵니다."}
          </div>
          <div className="history-modal-data">
            <span>
              {histories[selected]?.date} - {histories[selected]?.time}
            </span>
            <br />
            <span>{histories[selected]?.id}</span>
          </div>
          <div className="history-modal-buttons">
            <button className="history-get-button" onClick={() => setGalleryDataFromHistory()}>
              불러오기
            </button>
            <button className="history-cancel-button" onClick={() => setShowHistoryModal(false)}>
              취소
            </button>
          </div>
        </div>
      </FullScreenModal>
    </div>
  );
}
