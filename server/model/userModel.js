import { startSession } from "mongoose";
import User from "../schema/userSchema.js";
//user에 관련된 동작만 하는 기능들

export async function findUserByID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    return await User.findOne({ userID });
  }
  return null;
}

//loadGalleryHistory
export async function findHistoryByID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    const data = await User.findOne({ userID });
    return data.history;
  }
  return new Map();
}
//updateUserGallery
export async function updateUserHistory(userID, galleryID, session) {
  const isExists = await User.exists({ userID });
  const now = Date.now();

  if (isExists) {
    const history = await findHistoryByID(userID);
    history.set(galleryID, now);
    return User.findOneAndUpdate({ userID }, { history }).session(session);
  }
  const history = { [galleryID]: now };
  return User.create(
    [
      {
        userID,
        isShared: false,
        lastShareModified: now,
        lastModified: now,
        history,
      },
    ],
    { session },
  );
}

//loadShareStatusFromUser
export async function findShareStatusByID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    const data = await User.findOne({ userID });
    return data.isShared;
  }
  return null;
}

//updateShareState
export async function updateShareState(userID, isShared) {
  const isExists = await User.exists({ userID });
  if (!isExists) return null;
  const res = await User.updateOne({ userID }, { isShared });
  return res;
}

//loadLastGalleryID
export async function findLastGalleryID(userID) {
  const history = await findHistoryByID(userID);
  const [result] = [...history].reduce(
    ([rescentID, rescentDate], [galleryID, date]) => {
      if (rescentDate < date) return [galleryID, date];
      return [rescentID, rescentDate];
    },
    [null, 0],
  );

  return result;
}
