import Header from "../../components/Header";
import { Toast } from "../../components/Toast/Toast";
import FloatLayout from "../../layouts/FloatLayout";
import SyncButton from "./SyncButton";
import lockStore from "../../store/lock.store";
import HistoryIcon from "../../assets/images/hamburger.svg";
import ThemeSeletor from "../../components/ThemeSelector";

export default function DomElements() {
  const { locked } = lockStore();
  return (
    <>
      {!locked && (
        <FloatLayout>
          <Header>
            <ThemeSeletor />
            <button>
              <img width={24} src={HistoryIcon} />
            </button>
          </Header>
          <SyncButton />
        </FloatLayout>
      )}
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
