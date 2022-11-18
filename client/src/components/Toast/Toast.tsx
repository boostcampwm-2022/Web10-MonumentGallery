import React, { useEffect } from "react";
import { IToast } from "../../@types/common";
import toastStore from "../../store/toast.store";
import "./toast.scss";

interface ToastProps {
  position: string;
  autoDelete: boolean;
  autoDeleteTime: number;
}

interface ToastItemProps {
  toast: IToast;
  position: string;
  autoDelete: boolean;
  autoDeleteTime: number;
}

function ToastItem({ toast, position, autoDelete, autoDeleteTime }: ToastItemProps) {
  const { removeToast } = toastStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (autoDelete) removeToast(toast);
    }, autoDeleteTime);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`notification toast ${position}`}
      style={{ backgroundColor: toast.backgroundColor }}
      onClick={() => removeToast(toast)}
    >
      <div className="notification-image">
        <img src={toast.icon} alt="" />
      </div>
      <div>
        <p className="notification-type">{toast.type}</p>
        <p className="notification-message">{toast.description}</p>
      </div>
    </div>
  );
}

Toast.defaultProps = {
  position: "bottom-right",
};

export function Toast({ position, autoDelete, autoDeleteTime }: ToastProps) {
  const { toastList } = toastStore();

  return (
    <div className={`notification-container ${position}`}>
      {toastList.map((toast: IToast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          position={position}
          autoDelete={autoDelete}
          autoDeleteTime={autoDeleteTime}
        />
      ))}
    </div>
  );
}
