import { startSession } from "mongoose";
import {
  saveGallery as saveGalleryFromDB,
  findGalleryByID,
  updateGalleryView,
  deleteByID,
} from "../model/galleryModel.js";
import {
  findUserByUserID,
  findHistoryByUserID,
  updateUserHistoryByUserID,
  findLastGalleryIDByUserID,
  findShareStatusByUserID,
  updateShareStateByUserID,
  deleteUserHistoryByID,
  findAllUserRandom,
  findAllUserShared,
} from "../model/userModel.js";
import { processDataFromRawContent, processDataForClient } from "./dataProcessService.js";
import { getImagePixelsFromPages } from "./imageProcessService.js";
import { createConnectionSSE, endConnectionSSE, writeMessageSSE } from "./sseService.js";
import { getChildPages, getRawContentsFromNotion, getRoot, getLimitTime } from "./getNotionContentService.js";
import hash from "../utils/hash.js";
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from "../utils/httpError.js";
import { Client } from "@notionhq/client";

function validateGalleryID(galleryID) {
  if (typeof galleryID !== "string" || galleryID.length !== 24) {
    return false;
  }
  return true;
}
export async function loadUserHistory(userID) {
  return findHistoryByUserID(userID);
}

export async function saveGallery(userID, userName, galleryData) {
  const session = await startSession();
  try {
    session.startTransaction();
    const galleryID = await saveGalleryFromDB(galleryData, session);
    await updateUserHistoryByUserID(userID, userName, galleryID, session);
    await session.commitTransaction();
    session.endSession();
    return galleryID;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    throw new InternalServerError("DB 저장 실패(갤러리 저장 실패)");
  }
}

export async function loadGallery(requestUserData, userID, galleryID = null) {
  if (galleryID === null) galleryID = await getLastGalleryID(userID);
  if (!validateGalleryID(galleryID)) throw new BadRequestError("올바른 갤러리 ID가 아닙니다!");
  const { ipaddr, requestUserID } = requestUserData;

  const user = await findUserByUserID(userID);
  if (!user) throw NotFoundError("존재하지 않는 사용자입니다.");

  const { history } = user;
  if (!history.has(galleryID)) throw new NotFoundError("갤러리를 찾을 수 없습니다!");

  const galleryData = await findGalleryByID(galleryID);
  if (galleryData === null) throw new NotFoundError("갤러리를 찾을 수 없습니다!");

  if (!user.isShared && userID !== requestUserID) {
    throw new ForbiddenError("비공개된 갤러리에 접근할 권한이 없습니다!");
  }

  await increaseViewCount(ipaddr, galleryData);

  return processDataForClient(galleryData);
}

async function increaseViewCount(ipaddr, galleryData) {
  const { views, viewers } = galleryData;
  const now = new Date().toLocaleDateString("ko-KR");
  const iphash = hash(ipaddr);
  const viewed = viewers.get(iphash) === now;

  if (iphash && (!viewed || ipaddr === "development")) {
    viewers.set(iphash, now);
    const session = await startSession();
    try {
      session.startTransaction();
      await updateGalleryView(galleryData._id, viewers, views, session);
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log("조회수 카운트 실패!");
      console.log(err);
    }
  }
}

export async function updateShareState(userID, isShared) {
  const session = await startSession();
  try {
    session.startTransaction();
    await updateShareStateByUserID(userID, isShared, session);
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    throw new InternalServerError("DB 저장 실패");
  }
}

export async function getLastGalleryID(userID) {
  const galleryID = await findLastGalleryIDByUserID(userID);
  if (galleryID === null) throw new NotFoundError("갤러리를 찾을 수 없습니다!");
  return galleryID;
}

export async function getGalleryHistory(userID) {
  const historyMap = await findHistoryByUserID(userID);
  return Object.fromEntries([...historyMap]);
}

export async function getUserGalleryStatus(userID) {
  const [lastGalleryID, isShared] = await Promise.all([
    findLastGalleryIDByUserID(userID),
    findShareStatusByUserID(userID),
  ]);

  return { isCreated: lastGalleryID !== null, isShared: isShared ?? false };
}

export async function deleteUserHistory(users) {
  const session = await startSession();
  try {
    session.startTransaction();
    await Promise.all(
      users.map(async (user) => {
        user.history.forEach(async (val, key) => {
          if (!(await deleteByID(key))) throw NotFoundError("갤러리를 찾을 수 없습니다.");
        });
        if (!(await deleteUserHistoryByID(user._id))) throw NotFoundError("존재하지 않는 유저입니다.");
        return user._id;
      }),
    );
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    throw new InternalServerError("DB 저장 실패");
  }
}

export async function createGalleryFromNotion(notionAccessToken, period, theme, userID, userName, res) {
  createConnectionSSE(res);
  const limitTime = getLimitTime(period);
  const notion = new Client({ auth: notionAccessToken });
  const nowTime = Date.now();
  writeMessageSSE(JSON.stringify({ kind: "노션 데이터 불러오는 중...", progress: 5, data: {} }), res);

  writeMessageSSE(JSON.stringify({ kind: "노션 데이터 불러오는 중...", progress: 10, data: {} }), res);
  let pageContents = await getRoot(notion, limitTime);
  console.log(pageContents);
  let deepth = 0;

  while (Object.keys(pageContents).length <= 85 && deepth++ < 2) {
    // console.log(pageContents);
    writeMessageSSE(
      JSON.stringify({
        kind: `노션 데이터 불러오는 중...`,
        progress: 20 + 10 * deepth <= 55 ? 20 + 10 * deepth : 55,
        data: {},
      }),
      res,
    );
    const childPages = await getChildPages(notion, pageContents, limitTime);
    // console.log(childPages);
    pageContents = { ...pageContents, ...childPages };
  }
  pageContents = Object.keys(pageContents)
    .splice(0, 85)
    .map((pageID) => {
      return pageContents[pageID];
    });

  console.log("notionData 처리 시간", Date.now() - nowTime);
  writeMessageSSE(JSON.stringify({ kind: "노션 데이터 불러오기 완료", progress: 60, data: {} }), res);

  writeMessageSSE(JSON.stringify({ kind: "이미지 가공 중...", progress: 65, data: {} }), res);
  const notionImageContent = await getImagePixelsFromPages(pageContents);
  writeMessageSSE(JSON.stringify({ kind: "이미지 가공 완료", progress: 70, data: {} }), res);

  writeMessageSSE(JSON.stringify({ kind: "키워드 추출 중...", progress: 75, data: {} }), res);
  const processedNotionContent = await processDataFromRawContent(notionImageContent, theme);
  writeMessageSSE(JSON.stringify({ kind: "키워드 추출 완료", progress: 80, data: {} }), res);

  writeMessageSSE(JSON.stringify({ kind: "DB에서 데이터 저장 중...", progress: 85, data: {} }), res);
  const galleryID = await saveGallery(userID, userName, processedNotionContent);
  writeMessageSSE(JSON.stringify({ kind: "DB에서 데이터 저장 완료", progress: 90, data: {} }), res);

  return galleryID;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
function getRandomDate() {
  //2022년 12월 5일부터 현 시간까지
  // return getRandomInt(1670224522812, Date.now());
  return getRandomInt(0, Date.now());
}
function checkValidIndex(searchState, idx) {
  if (!(idx in searchState)) return true;
  return searchState[idx].valid;
}
function getRandomIndex(searchState) {
  let res = getRandomInt(0, 5);
  const start = res;
  if (!checkValidIndex(searchState, res)) res = (res + 1) % 5;

  while (!checkValidIndex(searchState, res) && start !== res) {
    res = (res + 1) % 5;
  }
  if (!checkValidIndex(searchState, res) && start === res) {
    console.log("오링", res); //데이터 다 씀!
    return -1;
  }
  return res;
}
export async function searchGalleryAll(requestSearchState) {
  if (!requestSearchState) requestSearchState = initSearchState();
  const nowIdx = getRandomIndex(requestSearchState);
  if (nowIdx === -1) return { searchState: requestSearchState, gallerys: [] };

  const { searchState, gallerys } = await searchGalleryRandom(requestSearchState, nowIdx);

  if (gallerys.length === 0) {
    const recentGallerys = await searchGalleryRecent(15);
    if (recentGallerys.length < 15) {
      Object.keys(searchState).forEach((key) => (searchState[key].valid = false));
    }
    return { searchState, gallerys: recentGallerys };
  }
  return { searchState, gallerys };
}

function initSearchState() {
  const randomDate = getRandomDate();
  const randIdxs = [0, 1, 2, 3, 4];
  return randIdxs.reduce((acc, cur) => {
    acc[cur] = { start: randomDate, last: randomDate, curved: false, valid: true };
    return acc;
  }, {});
}

async function searchGalleryRecent(limit) {
  const recentUsers = await findAllUserShared(15);
  return await Promise.all(
    recentUsers.map(async (user) => {
      const [lastGalleryID] = [...user.history].reduce(
        ([recentID, recentDate], [galleryID, date]) => {
          if (recentDate < date) return [galleryID, date];
          return [recentID, recentDate];
        },
        [null, 0],
      );
      //map에 null들어가면 어케 되려나
      const gallery = await findGalleryByID(lastGalleryID);

      return {
        userName: user.userName,
        keywords: gallery.totalKeywords.slice(0, 3).map((keywordData) => keywordData.keyword),
        galleryURL: `/gallery/${user.userID}/${lastGalleryID}`,
      };
    }),
  );
}

async function searchGalleryRandom(searchState, nowIdx) {
  const users = await findAllUserRandom(nowIdx, searchState[nowIdx].last, 15);
  console.log(users);
  const gallerys = await Promise.all(
    users.map(async (user) => {
      const [lastGalleryID] = [...user.history].reduce(
        ([recentID, recentDate], [galleryID, date]) => {
          if (recentDate < date) return [galleryID, date];
          return [recentID, recentDate];
        },
        [null, 0],
      );
      //map에 null들어가면 어케 되려나
      const gallery = await findGalleryByID(lastGalleryID);
      console.log(user._id);
      return {
        userName: user.userName,
        keywords: gallery.totalKeywords.slice(0, 3).map((keywordData) => keywordData.keyword),
        galleryURL: `/gallery/${user.userID}/${lastGalleryID}`,
      };
    }),
  );

  if (users.length > 0) searchState[nowIdx].last = Date.parse(users.at(-1).lastModified);

  const { start, last, curved } = searchState[nowIdx];

  if (users.length < 15 && !curved) {
    //끝 도달
    console.log("curved", nowIdx);
    searchState[nowIdx].curved = true;
    searchState[nowIdx].last = 0;
  } else if (curved && (users.length < 15 || last >= start)) {
    //전체 데이터 크기가 작은 경우 or 한바퀴 돈 경우
    searchState[nowIdx].valid = false;
    // console.log(searchState);
  }
  // console.log(searchState);
  return { searchState, gallerys };
}
//search
//{'0' : {start: Date, last : Date(가장 마지막으로 불러온 것), curved: 끝도달 여부}}
