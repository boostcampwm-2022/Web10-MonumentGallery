import { useEffect } from "react";
import axios from "axios";
import userStore from "../store/user.store";
import { createResource } from "../utils/suspender";
import { User } from "../@types/common";

export function useLoggedIn() {
  const { isLoggedIn, user, setUser, clearUser } = userStore();

  useEffect(() => {
    axios.get("/auth/check").then((res) => {
      const { logined, user } = res.data;
      if (logined) {
        setUser(user);
        return;
      }
      clearUser();
    });
  }, []);

  return [isLoggedIn, user] as const;
}

export interface ICheck {
  logined: boolean;
  user: User;
  isShared: boolean;
}

const resource = createResource<ICheck>({ method: "get", url: "/auth/check" });

export function CheckLoggedIn() {
  const { setUser, setShared, clearUser } = userStore();
  const res = resource.read();
  if (!res.data || res.error) return null;
  const { logined, user, isShared } = res.data;

  useEffect(() => {
    if (logined) {
      setUser(user);
      setShared(isShared);
    } else {
      clearUser();
    }
  }, []);
  return null;
}
