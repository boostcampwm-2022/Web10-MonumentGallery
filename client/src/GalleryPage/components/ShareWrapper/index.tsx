import SyncButton from "../SyncButton";
import ShareButton from "../ShareButton";

import userStore from "../../../store/user.store";
import galleryStore from "../../../store/gallery.store";

import "./style.scss";

export default function ShareWrapper() {
  const galleryOwnerId = galleryStore((gallery) => gallery.userId);
  const userId = userStore((user) => user.user?.id);
  const isLoggedIn = userStore((user) => user.isLoggedIn);
  const isOwnGallery = isLoggedIn && galleryOwnerId === userId;
  console.log(isOwnGallery);

  return (
    <div className={`share-wrapper${isOwnGallery ? "" : " hidden"}`}>
      <SyncButton />
      <ShareButton />
    </div>
  );
}
