import Gallery from "../schema/gallerySchema.js";

export async function deleteByID(galleryID) {
  const isExists = await Gallery.exists({ _id: galleryID });
  if (!isExists) return null;
  await Gallery.findByIdAndDelete(galleryID);
  return galleryID;
}
