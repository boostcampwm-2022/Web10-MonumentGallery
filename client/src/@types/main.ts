export interface IPreviewGalleryData {
  userName: string;
  keywords: string[];
  galleryURL: string;
}

export type IMainDataResponse = {
  gallery: IPreviewGalleryData[];
  searchState: string;
};
