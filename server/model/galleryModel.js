import Gallery from "../schema/gallerySchema.js";

export async function saveGallery(galleryData, session) {
  const [createdData] = await Gallery.create([galleryData], { session });
  return createdData._id.valueOf();
}

export async function findGalleryByID(galleryID) {
  if (galleryID === null) return null;
  return await Gallery.findById(galleryID);
}
export async function updateGalleryView(galleryID, viewers, views, session) {
  await Gallery.updateOne({ _id: galleryID }, { views: views + 1, viewers }).session(session);
}
