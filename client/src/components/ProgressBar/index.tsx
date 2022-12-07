/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import "./style.scss";

interface IOnLoadFunction {
  <T>(a: T): void;
}

interface ProgressBarProps {
  eventSourceUrl: string;
  onLoad: IOnLoadFunction;
}

interface IResponse {
  kind: string;
  progress: number;
  data: unknown;
}

export default function ProgressBar({ eventSourceUrl, onLoad }: ProgressBarProps) {
  const [listening, setListeing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reloader, setReload] = useState(4);
  const style = useSpring({ translateX: progress + "%", duration: 1000 });

  const textRef = useRef<HTMLDivElement>(null!);
  let eventSource: EventSource;
  useEffect(() => {
    if (!listening) {
      eventSource = new EventSource(eventSourceUrl, {
        withCredentials: true,
      });
      eventSource.onmessage = (event) => {
        const res: IResponse = JSON.parse(event.data);
        setProgress(res.progress);
        textRef.current.innerText = res.kind;
        if (res.progress === 100) onLoad(res.data);
      };
      eventSource.onerror = (e) => {
        let timer = 3;
        const interval = setInterval(() => {
          textRef.current.innerText = `에러가 발생했습니다. ${timer}초 뒤 다시 시도합니다.`;
          timer--;
          if (timer === -1) {
            setListeing(false);
            setProgress(0);
            if (reloader > 0) setReload((reloader) => reloader - 1);
            clearInterval(interval);
          }
        }, 1000);
      };

      setListeing(true);
      return () => eventSource?.close();
    }
  }, [reloader]);

  return (
    <>
      <div className="container">
        <div className="progress-bar__container">
          <animated.div className="progress-bar" style={style}></animated.div>
        </div>
      </div>
      <div className="progress-bar__text" ref={textRef}>
        로딩을 시작합니다.
      </div>
    </>
  );
}
