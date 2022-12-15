import axios, { AxiosResponse } from "axios";
import { IGalleryDataResponse } from "../@types/gallery";
import { IMainDataResponse } from "../@types/main";
import { ICheck } from "../hooks/useLoggedIn";
import { mainVanillaStore } from "./main.store";
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

export const mainSelector = (positionKey?: string, searchState?: string) =>
  select<AxiosResponse<IMainDataResponse>>({
    key: `main selector ${positionKey}`,
    get: () => axios({ method: "get", params: { searchState }, url: "/api/gallery/all" }),
  });

export const splashSelector = () =>
  select({
    key: "splash selector",
    get: () =>
      new Promise<void>((resolve) => {
        const { getState } = mainVanillaStore;
        const interval = setInterval(() => {
          const { grid, showSplash } = getState();
          if (!showSplash && grid["[-1,-1]"]) {
            clearInterval(interval);
            resolve();
          }
        }, 500);
      }),
  });
