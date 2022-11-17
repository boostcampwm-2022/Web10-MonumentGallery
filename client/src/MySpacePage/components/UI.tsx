import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast, Toast } from "../../components/Toast/Toast";
import { TOAST_SUCCESS, TOAST_INFO, TOAST_ERROR, TOAST_WARNING } from "../../components/Toast/ToastList";
import "../style.scss";
export default function UI() {
  const [toastList, setToastList] = useState<toast[]>([]);
  async function getResponse() {
    try {
      const response = await axios.get("/test/invalid-url");
      if (response.status === 200) {
        const toast = TOAST_SUCCESS;
        setToastList([...toastList, toast]);
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response !== undefined && err.response.status === 404) {
        const toast = TOAST_ERROR;
        setToastList([...toastList, toast]);
      }
    }
  }
  return (
    <>
      <h1 className="logo"> MONUMENT GALLERY (테스트용 UI) </h1>
      <button className="toast-test-btn" onClick={() => getResponse()}>
        토스트 테스트 버튼
      </button>
      <Toast toastList={toastList} position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
