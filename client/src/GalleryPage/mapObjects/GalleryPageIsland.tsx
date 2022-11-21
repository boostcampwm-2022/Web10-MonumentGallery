import { IGalleryPageData } from "../../@types/gallery";
import Island from "./Island";

export default function GalleryPageIsland({ position }: IGalleryPageData) {
  return (
    <>
      <Island x={position[0]} z={position[1]} />
    </>
  );
}
