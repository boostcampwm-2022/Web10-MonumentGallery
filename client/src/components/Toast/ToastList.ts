import checkIcon from "../../assets/images/toast-icon-check.svg";
import errorIcon from "../../assets/images/toast-icon-error.svg";
import infoIcon from "../../assets/images/toast-icon-info.svg";
import warningIcon from "../../assets/images/toast-icon-warning.svg";

export const TOAST_LIST = [
  {
    id: Math.floor(Math.random() * 101 + 1),
    type: "SUCCESS",
    description: "This is a success toast component",
    backgroundColor: "#5cb85c",
    icon: checkIcon,
  },
  {
    id: Math.floor(Math.random() * 101 + 1),
    type: "ERROR",
    description: "This is an error toast component",
    backgroundColor: "#d9534f",
    icon: errorIcon,
  },
  {
    id: Math.floor(Math.random() * 101 + 1),
    type: "INFO",
    description: "This is an info toast component",
    backgroundColor: "#5bc0de",
    icon: infoIcon,
  },
  {
    id: Math.floor(Math.random() * 101 + 1),
    type: "WARNING",
    description: "This is a warning toast component",
    backgroundColor: "#f0ad4e",
    icon: warningIcon,
  },
];
