import express from "express";
import { authMiddleware, catchAuthError } from "../middleware/authMiddleware.js";
import { processDataForClient } from "../service/dataProcessService.js";
import { loadGallery, loadLastGallery, getGalleryHistory, getLastGalleryID } from "../service/dataSaveService.js";
import { asyncHandler } from "../utils/utils.js";
import { updateShareState } from "../model/galleryModel.js";
import { createGallery } from "../service/galleryService.js";
import { writeMessageSSE, endConnectionSSE } from "../service/sseService.js";

const router = express.Router();

router.post(
  "/gallery",
  authMiddleware,
  catchAuthError,
  asyncHandler(async (req, res) => {
    //duration= 2w||1m||3m||1y
    console.log("page making start");
    const userID = req.userid;
    const nowTime = Date.now();

    const galleryID = await createGallery(req, res);

    console.log(`총 처리 시간: ${Date.now() - nowTime}`);
    endConnectionSSE(res, { page: `/gallery/${userID}/${galleryID}` });
  }),
);

router.post(
  "/gallery/sync",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userID = req.userid;
    const nowTime = Date.now();
    const galleryID = await createGallery(req, res);

    writeMessageSSE(JSON.stringify({ kind: "DB에서 데이터 불러오는 중...", progress: 90, data: data }), res);
    const result = await loadGallery(userID, galleryID);
    writeMessageSSE(JSON.stringify({ kind: "DB에서 데이터 불러오기 완료", progress: 95, data: data }), res);

    console.log(`총 처리 시간: ${Date.now() - nowTime}`);
    endConnectionSSE(res, processDataForClient(result));
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
    await updateShareState(req.userid, isShared);
    res.status(200).json();
  }),
);

export default router;
