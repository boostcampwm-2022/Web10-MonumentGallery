import React, { useEffect, useState } from "react";
import { IToast } from "../../@types/common";
import toastStore from "../../store/toast.store";
import "./toast.scss";
interface ToastProps {
  position: string;
  autoDelete: boolean;
  autoDeleteTime: number;
}

Toast.defaultProps = {
  position: "bottom-right",
};
export function Toast({ position, autoDelete, autoDeleteTime }: ToastProps) {
  const { toastList } = toastStore();
  const [list, setList] = useState(toastList);

  useEffect(() => {
    setList(toastList);
  }, [toastList, list]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoDelete && toastList.length && list.length) {
        deleteToast(toastList[0].id);
      }
    }, autoDeleteTime);
    return () => {
      clearInterval(interval);
    };
  }, [toastList, autoDelete, autoDeleteTime, list]);

  function deleteToast(id: number) {
    const index = list.findIndex((e) => e.id === id);
    list.splice(index, 1);
    const toastListItem = toastList.findIndex((e) => e.id === id);
    toastList.splice(toastListItem, 1);
    setList([...list]);
  }
  return (
    <>
      <div className={`notification-container ${position}`}>
        {list.map((toast: IToast, i) => (
          <div key={i} className={`notification toast ${position}`} style={{ backgroundColor: toast.backgroundColor }}>
            <div className="notification-image">
              <img src={toast.icon} alt="" />
            </div>
            <div>
              <p className="notification-type">{toast.type}</p>
              <p className="notification-message">{toast.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
