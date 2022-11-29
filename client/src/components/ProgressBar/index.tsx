import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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
  const barRef = useRef(null!);
  const textRef = useRef<HTMLDivElement>(null!);
  let eventSource: EventSource;
  useEffect(() => {
    if (!listening) {
      eventSource = new EventSource(eventSourceUrl, {
        withCredentials: true,
      });
      eventSource.onmessage = (event) => {
        const res: IResponse = JSON.parse(event.data);
        gsap.to(barRef.current, {
          x: `${res.progress}%`,
          duration: 2,
          onStart: () => {
            textRef.current.innerText = res.kind;
          },
          onComplete: () => {
            if (res.progress === 100) {
              onLoad(res.data);
            }
          },
        });
      };
      eventSource.onerror = (e) => {
        let timer = 3;
        const interval = setInterval(() => {
          textRef.current.innerText = `에러가 발생했습니다. ${timer}초 뒤 다시 시도합니다.`;
          timer--;
          if (timer === 0) {
            setListeing(false);
            clearInterval(interval);
          }
        }, 1000);
      };

      setListeing(true);
      return () => eventSource?.close();
    }
  }, []);

  return (
    <>
      <div className="container">
        <div className="progress-bar__container">
          <div className="progress-bar" ref={barRef}></div>
        </div>
      </div>
      <div className="progress-bar__text" ref={textRef}>
        로딩을 시작합니다.
      </div>
    </>
  );
}
