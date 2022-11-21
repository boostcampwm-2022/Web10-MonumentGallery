import { IGallaryPageData } from "../../@types/common";
import Island from "./Island";

export default function GalleryPageIsland({ position }: IGallaryPageData) {
  return (
    <>
      <Island x={position[0]} z={position[1]} />
    </>
  );
}
