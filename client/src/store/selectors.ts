import axios, { AxiosResponse } from "axios";
import { ICheck } from "../hooks/useLoggedIn";
import { select } from "./select";

export const loginSelector = () =>
  select<AxiosResponse<ICheck>>({
    key: "login selector",
    get: () => axios({ method: "get", url: "/auth/check" }),
  });
