import User from "../schema/userSchema.js";

export async function findUserByUserID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    return await User.findOne({ userID });
  }
  return null;
}

export async function findHistoryByUserID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    const data = await User.findOne({ userID });
    return data.history;
  }
  return new Map();
}

export async function updateUserHistoryByUserID(userID, galleryID, session) {
  const isExists = await User.exists({ userID });
  const now = Date.now();

  if (isExists) {
    const history = await findHistoryByUserID(userID);
    history.set(galleryID, now);
    return User.findOneAndUpdate({ userID }, { history }).session(session);
  }
  const history = { [galleryID]: now };
  return User.create(
    [
      {
        userID,
        isShared: false,
        lastModified: now,
        history,
      },
    ],
    { session },
  );
}

export async function deleteUserHistoryByID(_id, session) {
  const isExists = await User.exists({ _id: _id });
  if (!isExists) return null;
  await User.findByIdAndUpdate(_id, { history: new Map() }).session(session);
  return _id;
}

export async function findShareStatusByUserID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    const data = await User.findOne({ userID });
    return data.isShared;
  }
  return null;
}

export async function updateShareStateByUserID(userID, isShared, session) {
  const isExists = await User.exists({ userID });
  if (!isExists) return null;
  const res = await User.updateOne({ userID }, { isShared, lastShareModified: Date.now() }).session(session);
  return res;
}

export async function findLastGalleryIDByUserID(userID) {
  const history = await findHistoryByUserID(userID);
  const [result] = [...history].reduce(
    ([rescentID, rescentDate], [galleryID, date]) => {
      if (rescentDate < date) return [galleryID, date];
      return [rescentID, rescentDate];
    },
    [null, 0],
  );

  return result;
}

export async function findAllUserNotShared(page, limit) {
  const yesterday = Date.now() - 1000 * 60 * 60 * 24;
  const users = await User.find({ isShared: false, lastShareModified: { $lte: yesterday } });
}
