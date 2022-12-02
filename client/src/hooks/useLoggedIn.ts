import { useEffect } from "react";
import userStore from "../store/user.store";
import { User } from "../@types/common";

export interface ICheck {
  logined: boolean;
  user: User;
  isShared: boolean;
  isCreated: boolean;
}

export function CheckLoggedIn() {
  const { getUser, setUser, setShared, setCreated, clearUser } = userStore();
  const { logined, user, isShared, isCreated } = getUser();

  useEffect(() => {
    if (logined) {
      setUser(user);
      setShared(isShared);
      setCreated(isCreated);
    } else {
      clearUser();
    }
  }, []);
  return null;
}
