import express from "express";
import { authMiddleware, catchAuthError } from "../middlewares/authMiddleware.js";
import {
  loadGallery,
  getGalleryHistory,
  createGalleryFromNotion,
  loadUserHistory,
  updateShareState,
  searchGalleryAll,
} from "../service/galleryService.js";
import { asyncHandler } from "../utils/utils.js";
import { endConnectionSSE } from "../service/sseService.js";
import { decodeBase64TOJSON, encodeBase64FromJSON } from "../utils/base64.js";

const router = express.Router();

router.get(
  "/gallery/all",
  asyncHandler(async (req, res) => {
    const cookieState = decodeBase64TOJSON(req.cookies.searchState);
    const { searchState, gallerys } = await searchGalleryAll(cookieState);

    res.cookie("searchState", encodeBase64FromJSON(searchState));
    res.status(200).json(gallerys);
  }),
);

router.get(
  "/gallery/create",
  authMiddleware,
  catchAuthError,
  asyncHandler(async (req, res) => {
    req.connection.setTimeout(60 * 5 * 1000); //5분
    //duration= 2w||1m||3m||1y
    console.log("page making start");
    const userId = req.userid;
    const userName = req.username;
    const nowTime = Date.now();
    const notionAccessToken = req.accessToken;
    const { period = "all", theme = "dream" } = req.query;

    const galleryID = await createGalleryFromNotion(notionAccessToken, period, theme, userId, userName, res);

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
    const requestUserID = req.userid;
    console.log(req.params);
    const { targetUserID, galleryID } = req.params;

    const result = await loadGallery({ ipaddr: req.ipaddr, requestUserID }, targetUserID, galleryID);
    res.status(200).json({ gallery: result, userId: targetUserID, page: `/gallery/${targetUserID}/${galleryID}` });
  }),
);

router.get(
  "/gallery/sync",
  authMiddleware,
  asyncHandler(async (req, res) => {
    req.connection.setTimeout(60 * 5 * 1000); //5분
    const requestUserID = req.userid;
    const requestUserName = req.username;
    const notionAccessToken = req.accessToken;
    const { period = "all", theme = "dream" } = req.query;

    const galleryID = await createGalleryFromNotion(
      notionAccessToken,
      period,
      theme,
      requestUserID,
      requestUserName,
      res,
    );

    const result = await loadGallery({ ipaddr: req.ipaddr, requestUserID }, requestUserID, galleryID);
    endConnectionSSE(res, { page: `/gallery/${requestUserID}/${galleryID}`, data: result });
  }),
);

router.get(
  "/gallery/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const requestUserID = req.userid;
    const { id } = req.params;

    const result = await loadGallery({ ipaddr: req.ipaddr, requestUserID }, id);
    res.status(200).json({ gallery: result, userId: id, page: `/gallery/${id}` });
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
    const history = await loadUserHistory(userid);
    const histories = [];
    history.forEach((data, id) => {
      const date = data.toLocaleDateString("ko-KR").slice(0, -1).replaceAll(". ", "-");
      histories.push({ id, date, time: data.toLocaleTimeString("ko-KR") });
    });
    res.status(200).json(histories);
  }),
);

export default router;
