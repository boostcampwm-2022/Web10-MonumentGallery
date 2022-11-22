export interface IKeywordMap {
  [keyword: string]: number;
}

export interface IGalleryPageSubTitle {
  text: string;
  type: "h1" | "h2" | "h3";
}

export interface IGalleryPageData {
  position: number[];
  title: string;
  subtitle: IGalleryPageSubTitle[];
  keywords: IKeywordMap;
  links?: {
    href: string;
    favicon?: string;
  };
  imagePixel?: number[][];
}

export interface IGalleryMapData {
  uuid: string;
  totalKeywords: IKeywordMap;
  pages: IGalleryPageData[];
  nodes: number[][];
}
