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

export function CheckLoggedIn({ resource }: { resource: Resource }) {
  const { setUser, clearUser } = userStore();
  const { logined, id: user } = useMemo(() => resource.read({ method: "get", url: "/auth/check" }) as ICheck, []);

  useEffect(() => {
    if (logined) {
      setUser(user);
    } else {
      clearUser();
    }
  }, []);
  return null;
}
