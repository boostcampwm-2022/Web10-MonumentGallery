import galleryStore from "../../store/gallery.store";
import "./style.scss";

export default function GalleryInfo() {
  const galleryData = galleryStore((store) => store.data);
  console.log(galleryData);

  return (
    <div className="galleryinfo">
      <div>
        {galleryData.userName} ({galleryData.id})
      </div>
    </div>
  );
}
