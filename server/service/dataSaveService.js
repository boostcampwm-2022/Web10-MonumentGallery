import {
  saveGallery as saveGalleryFromDB,
  loadGallery as loadGalleryFromDB,
  loadLastGallery as loadLastGalleryFromDB,
  loadLastGalleryID as loadLastGalleryIDFromDB,
  loadUserGalleryList as loadUserGalleryListFromDB,
} from "../model/galleryModel.js";
import { BadRequestError, NotFoundError, InternalServerError } from "../utils/httpError.js";

function validateGalleryID(galleryID) {
  if (typeof galleryID !== "string" || galleryID.length !== 24) {
    return false;
  }
  return true;
}

export async function saveGallery(userID, galleryData) {
  console.log("으악!!!");
  console.log(galleryData);
  const id = await saveGalleryFromDB(userID, galleryData);
  if (id === null) throw new InternalServerError("DB 저장 실패");
  return id;
}

export async function loadGallery(userID, galleryID = null) {
  if (galleryID === null) return loadLastGallery(userID);
  if (!validateGalleryID(galleryID)) throw new BadRequestError("올바른 갤러리 ID가 아닙니다!");
  const result = await loadGalleryFromDB(userID, galleryID);
  if (result.success) return result.data;
  if (result.err === "not_found") throw new NotFoundError("갤러리를 찾을 수 없습니다!");
  throw new BadRequestError("올바른 갤러리 ID가 아닙니다!");
}

export async function loadLastGallery(userID) {
  const result = await loadLastGalleryFromDB(userID);
  if (result === null) throw new NotFoundError("갤러리를 찾을 수 없습니다!");
  return result;
}

export async function getGalleryHistory(userID) {
  return Object.fromEntries( [...loadUserGalleryList(userID)] );
}

export function getLastGalleryID(userID) {
  return loadLastGalleryIDFromDB(userID);
}
