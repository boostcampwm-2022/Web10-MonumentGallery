import express from "express";
import { authMiddleware, catchAuthError } from "../middleware/authMiddleware.js";
import { getRawContentsFromNotion } from "../service/getNotionContentService.js";
import { processDataFromRawContent, processDataForClient } from "../service/dataProcessService.js";
import {
  saveGallery,
  loadGallery,
  loadLastGallery,
  getGalleryHistory,
  getLastGalleryID,
} from "../service/dataSaveService.js";
import { asyncHandler } from "../utils/utils.js";
import { updateShareState } from "../model/galleryModel.js";
import { getImagePixelsFromPages } from "../service/imageProcessService.js";

const router = express.Router();

router.post(
  "/gallery",
  authMiddleware,
  catchAuthError,
  asyncHandler(async (req, res) => {
    //timeout 5분..
    req.connection.setTimeout(60 * 5 * 1000);
    //duration= 2w||1m||3m||1y
    console.log("page making start");
    const userID = req.userid;
    const notionAccessToken = req.accessToken;
    const nowTime = Date.now();
    const { period = "all", theme = "dream" } = req.query;

    const notionRawContent = await getRawContentsFromNotion(notionAccessToken, period);
    const notionImageContent = await getImagePixelsFromPages(notionRawContent);
    // console.log(notionImageContent);
    const processedNotionContent = await processDataFromRawContent(notionImageContent, theme);
    const galleryID = await saveGallery(userID, processedNotionContent);

    console.log(`총 처리 시간: ${Date.now() - nowTime}`);
    res.status(200).json({ page: `/gallery/${userID}/${galleryID}` });
  }),
);

router.get(
  "/gallery/history/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await getGalleryHistory(id);
    res.status(200).json(result);
  }),
);

router.get(
  "/gallery/:targetUserID/:galleryID",
  authMiddleware,
  asyncHandler(async (req, res) => {
    // const userID = req.userid;
    console.log(req.params);
    const { targetUserID, galleryID } = req.params;

    const result = await loadGallery(targetUserID, galleryID);
    res.status(200).json({ gallery: processDataForClient(result), userId: targetUserID });
  }),
);

router.get(
  "/gallery/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("hey!", id);

    const result = await loadLastGallery(id);
    res.status(200).json(result);
  }),
);

router.get(
  "/user/lastGallery",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userID = req.userid;

    const result = await getLastGalleryID(userID);
    res.status(200).json({ result });
  }),
);

router.post(
  "/user/share",
  authMiddleware,
  catchAuthError,
  asyncHandler(async (req, res) => {
    const { isShared } = req.body;
    const result = await updateShareState(req.userid, isShared);
    console.log(result);
    res.status(200).json();
  }),
);

export default router;
