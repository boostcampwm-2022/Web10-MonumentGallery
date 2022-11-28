import React from "react";
import Header from "../components/Header";
import UserInfoSkeleton from "../components/Header/UserInfoSkeleton";
import FloatLayout from "../layouts/FloatLayout";

export default function Loading() {
  return (
    <div>
      <FloatLayout>
        <Header>
          <UserInfoSkeleton />
        </Header>
        <button className="upload-btn" type="button"></button>
      </FloatLayout>
    </div>
  );
}
