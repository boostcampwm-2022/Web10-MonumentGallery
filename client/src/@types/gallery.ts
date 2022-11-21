export interface IKeywordMap {
  [keyword: string]: number;
}

export interface IGallaryPageData {
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

export interface IGallaryMapData {
  uuid: string;
  totalKeywords: IKeywordMap;
  pages: IGallaryPageData[];
  nodes: number[][];
}
