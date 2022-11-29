import { saveGallery } from "./dataSaveService.js";
import { processDataFromRawContent, processDataForClient } from "./dataProcessService.js";
import { getImagePixelsFromPages } from "./imageProcessService.js";
import { createConnectionSSE, endConnectionSSE, writeMessageSSE } from "./sseService.js";
import { getRawContentsFromNotion } from "./getNotionContentService.js";

export async function createGallery(notionAccessToken, period, theme, userID, res) {
  createConnectionSSE(res);

  writeMessageSSE(JSON.stringify({ kind: "노션 데이터 불러오는 중...", progress: 25, data: {} }), res);
  const notionRawContent = await getRawContentsFromNotion(notionAccessToken, period);
  writeMessageSSE(JSON.stringify({ kind: "노션 데이터 불러오기 완료", progress: 50, data: {} }), res);

  writeMessageSSE(JSON.stringify({ kind: "이미지 가공 중...", progress: 55, data: {} }), res);
  const notionImageContent = await getImagePixelsFromPages(notionRawContent);
  writeMessageSSE(JSON.stringify({ kind: "이미지 가공 완료", progress: 60, data: {} }), res);

  writeMessageSSE(JSON.stringify({ kind: "키워드 추출 중...", progress: 65, data: {} }), res);
  const processedNotionContent = await processDataFromRawContent(notionImageContent, theme);
  writeMessageSSE(JSON.stringify({ kind: "키워드 추출 완료", progress: 70, data: {} }), res);

  writeMessageSSE(JSON.stringify({ kind: "DB에서 데이터 저장 중...", progress: 80, data: {} }), res);
  const galleryID = await saveGallery(userID, processedNotionContent);
  writeMessageSSE(JSON.stringify({ kind: "DB에서 데이터 저장 완료", progress: 85, data: {} }), res);

  return galleryID;
}
