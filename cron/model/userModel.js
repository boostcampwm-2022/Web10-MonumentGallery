import User from "../schema/userSchema.js";

export async function deleteUserHistoryByID(_id, session) {
  const isExists = await User.exists({ _id: _id });
  if (!isExists) return null;
  await User.findByIdAndUpdate(_id, { history: new Map() }).session(session);
  return _id;
}

export async function findAllUserNotShared(skip, limit) {
  return await User.find({
    isShared: false,
  })
    .sort({ lastModified: -1 })
    .skip(skip)
    .limit(limit);
}
