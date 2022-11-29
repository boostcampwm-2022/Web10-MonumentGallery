import { useEffect, useState } from "react";
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
  data: any;
}

export default function ProgressBar({ eventSourceUrl, onLoad }: ProgressBarProps) {
  const [response, setReponse] = useState<IResponse>();
  const [listening, setListeing] = useState(false);
  let eventSource: EventSource;
  useEffect(() => {
    if (!listening) {
      eventSource = new EventSource(eventSourceUrl, {
        withCredentials: true,
      });
      eventSource.onmessage = (event) => {
        const res = JSON.parse(event.data);
        setReponse(res);
      };
      setListeing(true);
    }
    if (response?.progress === 100) {
      eventSource?.close();
      onLoad(response.data);
    }
  }, [response]);

  return (
    <>
      <h1>{response?.kind}</h1>
      <progress className="progress-bar" value={response?.progress} max={100}></progress>
    </>
  );
}
