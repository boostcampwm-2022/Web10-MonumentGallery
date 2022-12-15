import User from "../schema/userSchema.js";

export async function deleteUserHistoryByID(_id, session) {
  const isExists = await User.exists({ _id: _id });
  if (!isExists) return null;
  await User.findByIdAndUpdate(_id, { history: new Map() }).session(session);
  return _id;
}

export async function findAllUserNotShared(page, limit) {
  return await User.find({
    _id: { $gt: page },
    isShared: false,
  })
    .sort({ _id: 1 })
    .limit(limit);
}

export async function findMinID() {
  return await User.find().sort({ _id: 1 }).limit(1);
}
