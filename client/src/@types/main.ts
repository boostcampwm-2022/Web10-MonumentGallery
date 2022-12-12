import springGround from "../assets/images/spring-ground.png";
import summerGround from "../assets/images/summer-ground.png";
import autumnGround from "../assets/images/autumn-ground.png";
import winterGround from "../assets/images/winter-ground.png";
import dreamGround from "../assets/images/dream-ground.png";
export interface IPreviewGalleryData {
  userName: string;
  keywords: string[];
  galleryURL: string;
}

export type IMainDataResponse = {
  gallery: IPreviewGalleryData[];
  searchState: string;
};
export const GROUND_TEXTURES = {
  DREAM: dreamGround,
  SPRING: springGround,
  SUMMER: summerGround,
  AUTUMN: autumnGround,
  WINTER: winterGround,
};
