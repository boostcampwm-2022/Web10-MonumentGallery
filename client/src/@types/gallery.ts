export interface IKeywordMap {
  [keyword: string]: number;
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
  uuid: string;
  theme: THEME;
  totalKeywords: IKeywordMap;
  pages: IGalleryPageData[];
  nodes: number[][];
}

export interface IGalleryDataResponse {
  gallery: IGalleryMapData;
  userId: string;
}

export interface IHistory {
  id: string;
  date: string;
  time: string;
  data: IGalleryMapData;
}

export const THEME = {
  DREAM: "DREAM",
  SPRING: "SPRING",
  SUMMER: "SUMMER",
  AUTUMN: "AUTUMN",
  WINTER: "WINTER",
} as const;
export type THEME = typeof THEME[keyof typeof THEME];
