import { useEffect, useMemo } from "react";
import axios from "axios";
import userStore from "../store/user.store";
import { Resource } from "../utils/suspender";
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

interface ICheck {
  logined: boolean;
  user: User;
}

export function CheckLoggedIn({ resource }: { resource: Resource<ICheck> }) {
  const { setUser, clearUser } = userStore();
  const res = useMemo(() => resource.read({ method: "get", url: "/auth/check" }), []);
  if (!res.data || res.error) return null;
  const { logined, user } = res.data;

  useEffect(() => {
    if (logined) {
      setUser(user);
    } else {
      clearUser();
    }
  }, []);
  return null;
}
