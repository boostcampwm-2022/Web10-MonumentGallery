import { Suspense } from "react";
import axios from "axios";
import ErrorBoundary from "../common/ErrorBoundary";
import UserInfoSkeleton from "./UserInfoSkeleton";
import { CheckLoggedIn } from "../../hooks/useLoggedIn";
import userStore from "../../store/user.store";

function onLoginClick() {
  window.location.href = "/auth/login";
}

function UserInfoError() {
  return (
    <div className="userinfo">
      <span className="userinfo-name">로그인 에러!</span>
      <button className="userinfo-button" onClick={onLoginClick}>
        로그인
      </button>
    </div>
  );
}

function UserInfoSuccess() {
  const user = userStore((store) => store.user);
  const clearUser = userStore((store) => store.clearUser);

  function onLogoutClick() {
    axios.post("/auth/logout").then(() => {
      clearUser();
      window.location.href = "/";
    });
  }

  return (
    <div className="userinfo">
      {user.avatarUrl && (
        <img className="userinfo-avatar" width="25" height="25" src={user.avatarUrl} alt="user avatar" />
      )}
      <span className="userinfo-name">{user.name}</span>
      <button className="userinfo-button" onClick={user.id ? onLogoutClick : onLoginClick}>
        {user.id ? "로그아웃" : "로그인"}
      </button>
    </div>
  );
}

export default function UserInfo() {
  return (
    <ErrorBoundary fallback={<UserInfoError />}>
      <Suspense fallback={<UserInfoSkeleton />}>
        <CheckLoggedIn />
        <UserInfoSuccess />
      </Suspense>
    </ErrorBoundary>
  );
}
