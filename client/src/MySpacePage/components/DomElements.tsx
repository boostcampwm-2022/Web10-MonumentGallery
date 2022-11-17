import React from "react";
import Header from "../../components/Header";
import { Toast } from "../../components/Toast/Toast";
import FloatLayout from "../../layouts/FloatLayout";
import lockStore from "../../store/lock.store";

export default function DomElements() {
  const { locked } = lockStore();

  return (
    <>
      {!locked && (
        <FloatLayout>
          <Header />
        </FloatLayout>
      )}
      <Toast position="bottom-right" autoDelete={true} autoDeleteTime={2000} />
    </>
  );
}
