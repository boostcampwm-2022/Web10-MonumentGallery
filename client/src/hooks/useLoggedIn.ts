import { useEffect, useMemo } from "react";
import axios from "axios";
import userStore from "../store/user.store";
import { Resource } from "../utils/suspender";

export function useLoggedIn() {
  const { isLoggedIn, userId, setUser, clearUser } = userStore();

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

  return [isLoggedIn, userId] as const;
}

interface ICheck {
  logined: boolean;
  id: string;
}

export function CheckLoggedIn({ resource }: { resource: Resource<ICheck> }) {
  const { setUser, clearUser } = userStore();
  const res = useMemo(() => resource.read({ method: "get", url: "/auth/check" }), []);
  if (!res.data || res.error) return null;
  const { logined, id: user } = res.data;

  useEffect(() => {
    if (logined) {
      setUser(user);
    } else {
      clearUser();
    }
  }, []);
  return null;
}
