import galleryStore from "../../../store/gallery.store";
import "./style.scss";

export default function ViewsCount() {
  const views = galleryStore((gallery) => gallery.data.views);

  return (
    <div className="share-view-count">
      <span data-views={views} className="share-span">
        조회:
      </span>
      <span className="share-span share-view-count">{views}</span>
    </div>
  );
}
