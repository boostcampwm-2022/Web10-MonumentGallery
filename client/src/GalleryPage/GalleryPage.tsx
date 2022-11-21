import "./style.scss";
import { Canvas } from "@react-three/fiber";
import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
import { Suspense, useMemo } from "react";
import { createResource, Resource } from "../utils/suspender";
import Loading from "./Loading";
import galleryStore from "../store/gallery.store";
export default function GalleryPage({ user, history }: { user: string; history: string }) {
  console.log({ user, history });

  return (
    <>
      <div className="canvas-outer">
        <Suspense fallback={<Loading />}>
          <Canvas className="canvas-inner" camera={{ fov: 75, near: 1, far: 20, position: [0, 5, 10] }}>
            <Gallery />
            <Data resource={createResource()} />
          </Canvas>
        </Suspense>
      </div>
      <DomElements />
    </>
  );
}

function Data({ resource }: { resource: Resource }) {
  const { setData } = galleryStore();
  useMemo(() => {
    const data = resource.read({ method: "get", url: "/test/gallery" });
    setData(data);
  }, []);
  return <></>;
}
