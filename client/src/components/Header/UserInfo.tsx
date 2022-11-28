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

  return (
    <div className="userinfo">
      {user.avatarUrl && <img className="userinfo-avatar" src={user.avatarUrl} />}
      <span className="userinfo-name">{user.name}</span>
      {user.id && (
        <button className="userinfo-logout" onClick={onLogoutClick}>
          로그아웃
        </button>
      )}
    </div>
  );
}
