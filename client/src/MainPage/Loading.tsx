import React from "react";
import Header from "../components/Header";
import FloatLayout from "../layouts/FloatLayout";

export default function Loading() {
  return (
    <div>
      <FloatLayout>
        <Header />
        <button className="upload-btn" type="button"></button>
      </FloatLayout>
    </div>
  );
}
