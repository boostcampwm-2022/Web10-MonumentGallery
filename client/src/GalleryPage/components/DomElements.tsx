import { useState } from "react";

import ShareWrapper from "./ShareWrapper";
import HistorySidebar from "./HistorySidebar";
import CrossPointer from "./CrossPointer";
import Header from "../../components/Header";
import UserInfo from "../../components/Header/UserInfo";
import ThemeSeletor from "../../components/ThemeSelector";
import Footer from "../../components/Footer";
import { Toast } from "../../components/Toast/Toast";
import FloatLayout from "../../layouts/FloatLayout";

import lockStore from "../../store/lock.store";
import HistoryIcon from "../../assets/images/hamburger.svg";

export default function DomElements({
  setRequestUrl,
}: {
  setRequestUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { locked } = lockStore();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div hidden={locked}>
        <FloatLayout>
          <Header>
            <UserInfo />
            <ThemeSeletor />
            <button>
              <img width={24} height={24} alt="history" src={HistoryIcon} onClick={() => setShowSidebar(!showSidebar)} />
            </button>
          </Header>
          <ShareWrapper />
          <Footer />
        </FloatLayout>
        <HistorySidebar show={showSidebar} setShow={setShowSidebar} setRequestUrl={setRequestUrl} />
      </div>
      <CrossPointer />
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
