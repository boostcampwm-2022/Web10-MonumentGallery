import "./style.scss";
import React from "react";
import LoadingImg from "../../../assets/loading.svg";

export default function Loading() {
  return (
    <div className="gallery-loading">
      <div className="loading-wrapper">
        <div>
          <span className="loading-text">당신의 멋진 공간이 만들어지는 중입니다</span>
        </div>
        <img width={200} src={LoadingImg} />
      </div>
    </div>
  );
}
