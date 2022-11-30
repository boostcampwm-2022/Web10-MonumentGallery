import express from "express";
import { authMiddleware, catchAuthError } from "../middleware/authMiddleware.js";
import { loadGallery, getGalleryHistory } from "../service/dataSaveService.js";
import { asyncHandler } from "../utils/utils.js";
import { updateShareState, loadUserGalleryList } from "../model/galleryModel.js";
import { createGallery } from "../service/galleryService.js";
import { endConnectionSSE } from "../service/sseService.js";

const router = express.Router();

router.get(
  "/gallery/create",
  authMiddleware,
  catchAuthError,
  asyncHandler(async (req, res) => {
    req.connection.setTimeout(60 * 5 * 1000); //5분
    //duration= 2w||1m||3m||1y
    console.log("page making start");
    const userId = req.userid;
    const nowTime = Date.now();
    const notionAccessToken = req.accessToken;
    const { period = "all", theme = "dream" } = req.query;

    const galleryID = await createGallery(notionAccessToken, period, theme, userId, res);

    console.log(`총 처리 시간: ${Date.now() - nowTime}`);
    endConnectionSSE(res, { page: `/gallery/${userId}/${galleryID}` });
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

    const result = await loadGallery(req.ipaddr, targetUserID, galleryID);
    res.status(200).json({ gallery: result, userId: targetUserID });
  }),
);

router.get(
  "/gallery/sync",
  authMiddleware,
  asyncHandler(async (req, res) => {
    req.connection.setTimeout(60 * 5 * 1000); //5분
    const userId = req.userid;

    const notionAccessToken = req.accessToken;
    const { period = "all", theme = "dream" } = req.query;

    const galleryID = await createGallery(notionAccessToken, period, theme, userId, res);

    const result = await loadGallery(req.ipaddr, userId, galleryID);
    endConnectionSSE(res, { page: `/gallery/${userId}/${galleryID}`, data: result });
  }),
);

router.get(
  "/gallery/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await loadGallery(req.ipaddr, id);
    res.status(200).json({ gallery: result, userId: id });
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

router.get(
  "/history/:userid",
  asyncHandler(async (req, res) => {
    const { userid } = req.params;
    const history = await loadUserGalleryList(userid);
    const histories = [];
    history.forEach((data, id) => {
      const date = data.toLocaleDateString().slice(0, -1).replaceAll(". ", "-");
      histories.push({ id, date, time: data.toLocaleTimeString() });
    });
    res.status(200).json(histories);
  }),
);

export default router;
