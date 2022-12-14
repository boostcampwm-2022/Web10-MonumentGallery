import checkIcon from "../../assets/images/toast-icon-check.svg";
import errorIcon from "../../assets/images/toast-icon-error.svg";
import infoIcon from "../../assets/images/toast-icon-info.svg";
import warningIcon from "../../assets/images/toast-icon-warning.svg";

const TOAST = {
  SUCCESS(description = "This is a success toast component", autoDeleteTime = 2000) {
    return {
      id: Math.floor(Math.random() * 100001 + 1),
      type: "SUCCESS",
      description,
      backgroundColor: "#5cb85c",
      icon: checkIcon,
      autoDeleteTime,
    };
  },
  ERROR(description = "This is a error toast component", autoDeleteTime = 2000) {
    return {
      id: Math.floor(Math.random() * 100001 + 1),
      type: "ERROR",
      description,
      backgroundColor: "#d9534f",
      icon: errorIcon,
      autoDeleteTime,
    };
  },
  INFO(description = "This is a info toast component", autoDeleteTime = 2000) {
    return {
      id: Math.floor(Math.random() * 100001 + 1),
      type: "INFO",
      description,
      backgroundColor: "#5bc0de",
      icon: infoIcon,
      autoDeleteTime,
    };
  },
  WARNING(description = "This is a warning toast component", autoDeleteTime = 2000) {
    return {
      id: Math.floor(Math.random() * 100001 + 1),
      type: "WARNING",
      description,
      backgroundColor: "#f0ad4e",
      icon: warningIcon,
      autoDeleteTime,
    };
  },
};

export default TOAST;
