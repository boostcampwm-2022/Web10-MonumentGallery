export interface IToast {
  id: number;
  type: string;
  description: string;
  backgroundColor: string;
  icon: string;
}

export interface IKeywordMap {
  [keyword: string]: number;
}

export interface IGallaryPageData {
  position: Array<number>;
  title: string;
  subtitle: Array<string>;
  keywords: IKeywordMap;
  links?: {
    href: string;
    favicon?: string;
  };
  imagePixel?: Array<Array<number>>;
}

export interface IGallaryMapData {
  uuid: string;
  totalKeywords: IKeywordMap;
  pages: Array<IGallaryPageData>;
  nodes: Array<Array<number>>;
}
