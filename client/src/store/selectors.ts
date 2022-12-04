import axios, { AxiosResponse } from "axios";
import { IGalleryDataResponse } from "../@types/gallery";
import { ICheck } from "../hooks/useLoggedIn";
import { select } from "./select";

export const loginSelector = () =>
  select<AxiosResponse<ICheck>>({
    key: "login selector",
    get: () => axios({ method: "get", url: "/auth/check" }),
  });

export const gallerySelector = (url?: string) =>
  select<AxiosResponse<IGalleryDataResponse>>({
    key: `gallery selector ${url}`,
    get: () => axios({ method: "get", url }),
  });
