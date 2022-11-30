import Gallery from "../schema/gallerySchema.js";

// async function loadGalleryHistory(userID) {
//   const isExists = await User.exists({ userID });
//   if (isExists) {
//     const data = await User.findOne({ userID });
//     return data.history;
//   }
//   return new Map();
// }

// async function updateUserGallery(userID, galleryID, session) {
//   const isExists = await User.exists({ userID });
//   const now = Date.now();

//   if (isExists) {
//     const history = await loadGalleryHistory(userID);
//     history.set(galleryID, now);
//     return User.findOneAndUpdate({ userID }, { history }).session(session);
//   }
//   const history = { [galleryID]: now };
//   return User.create(
//     [
//       {
//         userID,
//         isShared: false,
//         lastShareModified: now,
//         lastModified: now,
//         history,
//       },
//     ],
//     { session },
//   );
// }

// async function loadShareStatus(userID) {
//   const isExists = await User.exists({ userID });
//   if (isExists) {
//     const data = await User.findOne({ userID });
//     return data.isShared;
//   }
//   return null;
// }

// async function updateShareState(userID, isShared) {
//   const isExists = await User.exists({ userID });
//   if (!isExists) return null;
//   const res = await User.updateOne({ userID }, { isShared });
//   return res;
// }

// export async function saveGallery(userID, galleryData) {
//   const session = await startSession();
//   try {
//     session.startTransaction();
//     const [createdData] = await Gallery.create([galleryData], { session });
//     const galleryID = createdData._id.valueOf();
//     await updateUserGallery(userID, galleryID, session);
//     await session.commitTransaction();
//     session.endSession();
//     return galleryID;
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.log(err);
//     return null;
//   }
// }
export async function saveGallery(galleryData, session) {
  const [createdData] = await Gallery.create([galleryData], { session });
  return createdData._id.valueOf();
}

export async function findGalleryByID(galleryID) {
  if (galleryID === null) return null;
  return await Gallery.findById(galleryID);
}
export async function updateGalleryView(galleryID, viewers, views, session) {
  await Gallery.updateOne({ _id: galleryID }, { views: views + 1, viewers }).session(session);
}

// export async function loadGallery(requestUserData, userID, galleryID) {
//   const { ipaddr, requestUserID } = requestUserData;

//   if (typeof galleryID !== "string" || galleryID.length !== 24) {
//     return { success: false, err: "bad_request" };
//   }
//   if ((await User.exists({ userID })) === false) return { success: false, err: "no user" };

//   const user = await User.findOne({ userID });
//   const { history } = user;
//   if (!history.has(galleryID)) return { success: false, err: "don't have gallery" };

//   const galleryData = await Gallery.findById(galleryID);
//   if (galleryData === null) return { success: false, err: "no gallery" };

//   console.log({ id: userID, requestUserID });

//   if (!user.isShared && userID !== requestUserID) return { success: false, err: "not authorized" };

//   // 조회수 관련 로직
//   const { views, viewers } = galleryData;

//   const now = new Date().toLocaleDateString();
//   const iphash = hash(ipaddr);
//   const viewed = viewers.get(iphash) === now;

//   if (iphash && (!viewed || ipaddr === "development")) {
//     viewers.set(iphash, now);
//     await Gallery.updateOne({ _id: galleryData._id }, { views: views + 1, viewers });
//   }
//   return { success: true, data: galleryData };
// }

// async function loadLastGalleryID(userID) {
//   const history = await loadGalleryHistory(userID);
//   const [result] = [...history].reduce(
//     ([rescentID, rescentDate], [galleryID, date]) => {
//       if (rescentDate < date) return [galleryID, date];
//       return [rescentID, rescentDate];
//     },
//     [null, 0],
//   );

//   return result;
// }
