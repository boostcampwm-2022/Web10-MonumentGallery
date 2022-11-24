import "./style.scss";
import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
import React, { Suspense } from "react";
import { createResource, Resource } from "../utils/suspender";
import Loading from "./components/Loading";
import galleryStore from "../store/gallery.store";
import useResource from "../hooks/useResource";
import { useParams } from "../hooks/useParams";
import { IGalleryMapData } from "../@types/gallery";
import themeStore from "../store/theme.store";

export default function GalleryPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="canvas-outer">
          <GalleryLoader resource={createResource()} />
        </div>
        <DomElements />
      </Suspense>
    </>
  );
}

function GalleryLoader({ resource }: { resource: Resource<IGalleryMapData> }) {
  const [user, history] = useParams("gallery", []);
  const { setData } = galleryStore();
  const { setTheme } = themeStore();
  useResource(resource, { method: "get", url: `/test/gallery/${user}/${history}` }, (res) => {
    setData(res);
    setTheme(res.theme);
  });
  return <Gallery />;
}
