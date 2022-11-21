import "./style.scss";
import { Canvas } from "@react-three/fiber";
import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
import React, { Suspense } from "react";
import { createResource, Resource } from "../utils/suspender";
import Loading from "./Loading";
import galleryStore from "../store/gallery.store";
import useResource from "../hooks/useResource";
import { useParams } from "../hooks/useParams";
export default function GalleryPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="canvas-outer">
          <CanvasLoader resource={createResource()} />
        </div>
        <DomElements />
      </Suspense>
    </>
  );
}

function CanvasLoader({ resource }: { resource: Resource }) {
  const [user, history] = useParams("gallery", []);

  const { setData } = galleryStore();
  useResource(resource, { method: "get", url: `/test/gallery/${user}/${history}` }, (res) => setData(res));
  return (
    <Canvas className="canvas-inner" camera={{ fov: 75, near: 1, far: 20, position: [0, 5, 10] }}>
      <Gallery />
    </Canvas>
  );
}
