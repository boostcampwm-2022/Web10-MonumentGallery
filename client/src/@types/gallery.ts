export interface IKeywordMap {
  [keyword: string]: number;
}

export interface IGalleryPageData {
  position: number[];
  title: string;
  subtitle: string[];
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
