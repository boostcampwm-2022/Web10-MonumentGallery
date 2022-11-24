import express from "express";
import axios from "axios";
import { asyncHandler } from "../utils/utils.js";
import { getRawContentsFromNotion } from "../service/getNotionContentService.js";
import { processDataFromRawContent } from "../service/dataProcessService.js";
import { 
  saveGallery, 
  loadGallery, 
  loadLastGallery, 
  getGalleryHistory, 
  getLastGalleryID
} from "../service/dataSaveService.js";

const router = express.Router();

router.post("/gallery", asyncHandler(async (req, res) => {
  //duration= 2w||1m||3m||1y
  const userID = req.userid;
  const notionAccessToken = req.accessToken;
  const nowTime = Date.now();
  const { period = "all", theme = "dream" } = req.query;

  const notionRawContent = await getRawContentsFromNotion(notionAccessToken, period);
  const processedNotionContent = await processDataFromRawContent(notionRawContent, theme);
  const galleryID = await saveGallery(processedNotionContent);

  console.log(`총 처리 시간: ${Date.now() - nowTime}`);
  res.status(200).json({page: `/gallery/${userID}/${galleryID}`});
}));

router.get("/gallery/history/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await getGalleryHistory(id);
  res.status(200).json(result);
}));

router.get("/gallery/:targetUserID/:galleryID", asyncHandler(async (req, res) => {
  // const userID = req.userid;
  const { targetUserID, galleryID } = req.params;

  const result = await loadGallery(targetUserID, galleryID);
  res.status(200).json(result);
}));

router.get("/gallery/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await loadLastGallery(id);
  res.status(200).json(result);
}));

router.get("/user/lastGallery", asyncHandler(async (req, res) => {
  const userID = req.userid;

  const result = await getLastGalleryID(userID);
  res.status(200).json(result);
}));

export default router;
