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
} from "../model/userModel.js";
import { processDataFromRawContent, processDataForClient } from "./dataProcessService.js";
import { getImagePixelsFromPages } from "./imageProcessService.js";
import { createConnectionSSE, endConnectionSSE, writeMessageSSE } from "./sseService.js";
import { getRawContentsFromNotion } from "./getNotionContentService.js";
import hash from "../utils/hash.js";
import { BadRequestError, NotFoundError, InternalServerError } from "../utils/httpError.js";

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
    throw new InternalServerError("DB 저장 실패");
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

  console.log({ id: userID, requestUserID });
  IncreaseViewCount(ipaddr, galleryData);

  return processDataForClient(galleryData);
}

async function IncreaseViewCount(ipaddr, galleryData) {
  const { views, viewers } = galleryData;
  const now = new Date().toLocaleDateString();
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
      console.log(err);
      throw new InternalServerError("DB 저장 실패");
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
  const galleryID = await saveGallery(userID, userName, processedNotionContent);
  writeMessageSSE(JSON.stringify({ kind: "DB에서 데이터 저장 완료", progress: 85, data: {} }), res);

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
  if (!(idx in searchState)) return false;
  const { start, last, curved } = searchState[idx];
  return start <= last && curved;
}
function getRandomIndex(searchState) {
  let res = getRandomInt(0, 5);
  const start = res;
  if (checkValidIndex(searchState, res)) res = (res + 1) % 5;

  while (checkValidIndex(searchState, res) && start !== res) {
    res = (res + 1) % 5;
  }
  if (checkValidIndex(searchState, res) && start === res) console.log("오링"); //데이터 다 씀!
  return res;
}
export async function searchGalleryRandom(searchState) {
  // console.log(searchState);
  const nowIdx = getRandomIndex(searchState);
  // console.log(nowIdx);

  const randomDate = getRandomDate();
  if (!(nowIdx in searchState)) searchState[nowIdx] = { start: randomDate, last: randomDate, curved: false };

  const users = await findAllUserRandom(nowIdx, searchState[nowIdx].last, 15);
  // console.log(users);
  const gallerys = await Promise.all(
    users.map(async (user) => {
      const [lastGalleryID] = [...user.history].reduce(
        ([rescentID, rescentDate], [galleryID, date]) => {
          if (rescentDate < date) return [galleryID, date];
          return [rescentID, rescentDate];
        },
        [null, 0],
      );
      //map에 null들어가면 어케 되려나
      const gallery = await findGalleryByID(lastGalleryID);

      return {
        userName: user.userName,
        titles: gallery.pages.slice(0, 3).map((page) => page.title),
        galleryURL: `/gallery/${user.userID}/${lastGalleryID}`,
      };
    }),
  );

  if (users.length > 0) searchState[nowIdx].last = Date.parse(users.at(-1).lastModified);
  if (users.length < 15) {
    searchState[nowIdx].curved = true;
    searchState[nowIdx].last = 0;
  }
  // console.log(searchState, "\n");
  return { searchState, gallerys };
}

//search
//{'0' : {start: Date, last : Date(가장 마지막으로 불러온 것), curved: 끝도달 여부}}
