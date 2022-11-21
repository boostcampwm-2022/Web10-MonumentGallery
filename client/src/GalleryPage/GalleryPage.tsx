import "./style.scss";
import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
export default function GalleryPage() {
  return (
    <>
      <div className="canvas-outer">
        <Gallery />
      </div>
      <DomElements />
    </>
  );
}
