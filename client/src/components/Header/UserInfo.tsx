import axios from "axios";
import userStore from "../../store/user.store";

export default function UserInfo() {
  const { user, clearUser } = userStore();

  function onLogoutClick() {
    axios.post("/auth/logout").then(() => {
      clearUser();
      window.location.href = "/";
    });
  }

  function onLoginClick() {
    window.location.href = "/auth/login";
  }

  return (
    <div className="userinfo">
      {user.avatarUrl && <img className="userinfo-avatar" src={user.avatarUrl} />}
      <span className="userinfo-name">{user.name}</span>
      {user.id ? (
        <button className="userinfo-button" onClick={onLogoutClick}>
          로그아웃
        </button>
      ) : (
        <button className="userinfo-button" onClick={onLoginClick}>
          로그인
        </button>
      )}
    </div>
  );
}
