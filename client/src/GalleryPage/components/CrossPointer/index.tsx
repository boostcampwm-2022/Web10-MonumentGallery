import lockStore from "../../../store/lock.store";
import "./style.scss";

export default function CrossPointer() {
  const { locked } = lockStore();
  return <div className={`cross-pointer${locked ? "" : " hidden"}`}>+</div>;
}
