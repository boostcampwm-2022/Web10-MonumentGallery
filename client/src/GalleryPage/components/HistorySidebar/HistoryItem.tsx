import { useState, useMemo } from "react";
import galleryStore from "../../../store/gallery.store";

import type { IHistory } from "../../../@types/gallery";

interface HistoryItemProps {
  distanceToSelected: number;
  history: IHistory;
  onClick: (distanceToSelected: number) => void;
}

export default function HistoryItem({ distanceToSelected, history, onClick }: HistoryItemProps) {
  const [hover, setHover] = useState(false);
  const data = galleryStore((store) => store.data);
  const offset = useMemo(() => Math.abs(distanceToSelected), [distanceToSelected]);

  return (
    <div key={history.id} className="history">
      {(hover || !distanceToSelected) && <span className="history-time">{history.time}</span>}
      <span
        style={history.id === data.id ? { backgroundColor: "#ffffff", color: "#222222" } : {}}
        className={`history-item history-item-${offset <= 4 ? offset : "plain"}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => onClick(distanceToSelected)}
      >
        {history.date}
      </span>
    </div>
  );
}
