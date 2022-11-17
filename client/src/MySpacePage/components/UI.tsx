import { useState } from "react";
import { toast, Toast } from "../../components/Toast/Toast";
import { TOAST_LIST } from "../../components/Toast/ToastList";
import "../style.scss";
export default function UI() {
  const [list, setList] = useState<toast[]>([]);
  function showToast(type: string) {
    const toast = TOAST_LIST.find((toast) => toast.type === type);
    if (toast) {
      setList([...list, toast]);
    }
  }
  return (
    <>
      <h1 className="logo"> MONUMENT GALLERY (테스트용 UI) </h1>
      <button className="toast-test-btn" onClick={() => showToast("ERROR")}>
        토스트 생성 테스트 버튼
      </button>
      <Toast toastList={list} position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
