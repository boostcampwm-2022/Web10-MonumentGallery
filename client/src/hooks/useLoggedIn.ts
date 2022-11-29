import { useEffect } from "react";
import userStore from "../store/user.store";
import { createResource } from "../utils/suspender";
import { User } from "../@types/common";

export interface ICheck {
  logined: boolean;
  user: User;
  isShared: boolean;
  isCreated: boolean;
}

const resource = createResource<ICheck>({ method: "get", url: "/auth/check" });

export function CheckLoggedIn() {
  const { setUser, setShared, setCreated, clearUser } = userStore();
  const res = resource.read();
  if (!res.data || res.error) return null;
  const { logined, user, isShared, isCreated } = res.data;

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
