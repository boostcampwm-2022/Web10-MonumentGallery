import "./style.scss";
import { useState, useEffect } from "react";
import LoadingImg from "../../assets/images/loading.svg";

function Ellipsis() {
  const [ellipseCount, setCount] = useState<number>(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => {
        if (count > 4) return 1;
        return count + 1;
      });
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return <span className="loading-text">{".".repeat(Math.min(ellipseCount, 3))}</span>;
}

export default function Loading({ text = "당신의 멋진 공간이 만들어지는 중입니다" }) {
  return (
    <div className="gallery-loading">
      <div className="loading-wrapper">
        <div>
          <span className="loading-text">{text}</span>
          <Ellipsis />
        </div>
        <img width={200} height={100} src={LoadingImg} alt="canvas-loading" />
      </div>
    </div>
  );
}
