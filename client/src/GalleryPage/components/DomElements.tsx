import React from "react";
import Header from "../../components/Header";
import { Toast } from "../../components/Toast/Toast";
import FloatLayout from "../../layouts/FloatLayout";
import lockStore from "../../store/lock.store";
import MenuIcon from "../../assets/images/hamburger.svg";
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
              <img width={24} src={MenuIcon} />
            </button>
          </Header>
        </FloatLayout>
      )}
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
