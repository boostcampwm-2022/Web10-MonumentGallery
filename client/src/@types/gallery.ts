import type { AxiosError } from "axios";
import type { THEME } from "../constants/theme";

export interface IKeywordMap {
  [keyword: string]: number;
}
export interface IGroupKeywordData {
  keyword: string;
  position: number[];
}

export interface IGalleryPageSubTitle {
  text: string;
  hType: "h1" | "h2" | "h3";
}

export interface IGalleryPageLink {
  href: string;
  favicon?: string;
}

export interface IGalleryPageData {
  position: number[];
  title: string;
  subtitle: IGalleryPageSubTitle[];
  keywords: IKeywordMap;
  links?: IGalleryPageLink[];
  imagePixel?: number[][];
}

export interface IGalleryMapData {
  id?: string;
  userName: string;
  theme: ThemeType;
  totalKeywords: IKeywordMap;
  groupKeywords: IGroupKeywordData[];
  pages: IGalleryPageData[];
  nodes: number[][];
  views?: number;
  modifiedDate?: number;
}

export interface IGalleryDataResponse {
  gallery: IGalleryMapData;
  userId: string;
  page?: string;
}

export interface IHistory {
  id: string;
  date: string;
  time: string;
}

export type GalleryLoadErrorEvent = Event & {
  detail?: AxiosError<GalleryLoadError>;
};

type GalleryLoadError = { reason: string };

export type PeriodType = "all" | "2w" | "1m" | "3m" | "1y";
export type ThemeType = typeof THEME[keyof typeof THEME];
