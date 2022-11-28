import userStore from "../../store/user.store";

export default function UserInfo() {
  const { user } = userStore();

  return (
    <>
      <img className="userinfo-avatar" src={user.avatarUrl} />
      <span className="userinfo-name">{user.name}</span>
    </>
  );
}
