import express from "express";
import axios from "axios";
import { getRawContentsFromNotion } from "../service/getNotionContentService.js";
import { processDataFromRawContent } from "../service/dataProcessService.js";

const router = express.Router();

router.post("/gallery", async (req, res) => {
  //duration= 2w||1m||3m||1y
  const notionAccessToken = req.accessToken;
  const nowTime = Date.now();
  const { period = "all", theme = "dream" } = req.query;

  const notionRawContent = await getRawContentsFromNotion(notionAccessToken, period);
  const processedNotionContent = await processDataFromRawContent(notionRawContent, theme);

  res.status(200).json(processedNotionContent);
  console.log(`총 처리 시간: ${Date.now() - nowTime}`);
});

export default router;
