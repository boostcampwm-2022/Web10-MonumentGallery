import User from "../schema/userSchema.js";

export async function findUserByID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    return await User.findOne({ userID });
  }
  return null;
}

export async function findHistoryByID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    const data = await User.findOne({ userID });
    return data.history;
  }
  return new Map();
}

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

export async function findShareStatusByID(userID) {
  const isExists = await User.exists({ userID });
  if (isExists) {
    const data = await User.findOne({ userID });
    return data.isShared;
  }
  return null;
}

export async function updateShareStateByID(userID, isShared, session) {
  const isExists = await User.exists({ userID });
  if (!isExists) return null;
  const res = await User.updateOne({ userID }, { isShared, lastShareModified: Date.now() }).session(session);
  return res;
}

export async function findLastGalleryIDByID(userID) {
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
