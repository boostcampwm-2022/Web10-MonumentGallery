import React from "react";
import ReactDOM from "react-dom/client";
import { parsePaths } from "../utils/path";
import GalleryPage from "./GalleryPage";

const [user, history] = parsePaths("gallery");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GalleryPage user={user} history={history} />
  </React.StrictMode>,
);
