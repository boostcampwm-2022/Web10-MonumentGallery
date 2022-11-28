import {
  saveGallery as saveGalleryFromDB,
  loadGallery as loadGalleryFromDB,
  loadLastGallery as loadLastGalleryFromDB,
  loadLastGalleryID as loadLastGalleryIDFromDB,
  loadUserGalleryList as loadUserGalleryListFromDB,
} from "../model/galleryModel.js";
import { BadRequestError, NotFoundError, InternalServerError } from "../utils/httpError.js";
//DB에서 데이터를 불러오는 로직

function validateGalleryID(galleryID) {
  if (typeof galleryID !== "string" || galleryID.length !== 24) {
    return false;
  }
  return true;
}

export async function saveGallery(userID, galleryData) {
  const id = await saveGalleryFromDB(userID, galleryData);
  if (id === null) throw new InternalServerError("DB 저장 실패");
  console.log("db저장 완료");
  return id;
}

export async function loadGallery(userID, galleryID = null) {
  if (galleryID === null) return loadLastGallery(userID);
  if (!validateGalleryID(galleryID)) throw new BadRequestError("올바른 갤러리 ID가 아닙니다!");
  const result = await loadGalleryFromDB(userID, galleryID);
  if (result.success) return result.data;
  if (result.err === "bad_request") throw new BadRequestError("갤러리를 찾을 수 없습니다!");
  throw new NotFoundError(result.err);
}

export async function loadLastGallery(userID) {
  const result = await loadLastGalleryFromDB(userID);
  if (result === null) throw new NotFoundError("갤러리를 찾을 수 없습니다!");
  return result;
}

export async function getGalleryHistory(userID) {
  const historyMap = await loadUserGalleryListFromDB(userID);
  return Object.fromEntries([...historyMap]);
}

export function getLastGalleryID(userID) {
  return loadLastGalleryIDFromDB(userID);
}
