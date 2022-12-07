import mongoose from "mongoose";
import dotenv from "dotenv";
import { deleteByID } from "./model/galleryModel.js";
import {
  deleteUserHistoryByID,
  findAllUserNotShared,
  findMinID,
} from "./model/userModel.js";
import cron from "node-cron";

async function deleteUserHistory(user) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    for (const [galleryID, value] of user.history) {
      if (!(await deleteByID(galleryID)))
        throw new Error(`${user._id} : ${key} 갤러리를 찾을 수 없습니다.`);
    }
    if (!(await deleteUserHistoryByID(user._id)))
      throw new Error(`${user._id} 존재하지 않는 유저입니다.`);

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    console.log(user._id);
  }
}

async function deleteAllUserNotShared() {
  let [page] = await findMinID();
  let isStart = true;
  let users = [];

  if (page?._id) await deleteUserHistory(page);

  while (isStart || users.length == 20) {
    console.log(page._id);
    isStart = false;
    users = await findAllUserNotShared(page._id, 20);

    for (let i = 0; i < users.length; i++) {
      await deleteUserHistory(users[i]);
    }
    // await Promise.all(
    //   users.map(async (user) => {
    //     await deleteUserHistory(user);
    //     return user._id;
    //   })
    // );

    // console.log(users);
    if (users.length > 0) page = users.at(-1);
  }

  console.log("complete");
}

// async function main() {
//   dotenv.config();

//   // mongoDB connection
//   const mongoURI = process.env.MONGO_URL;
//   mongoose.connect(mongoURI);
//   const db = mongoose.connection;
//   db.once("open", () => console.log("DB successfully connected"));
//   db.on("error", (err) => console.log("DB connection failed : ", err));

//   await deleteAllUserNotShared();

//   db.close();
// }

cron.schedule("0 */12 * * *", async function () {
  dotenv.config();

  // mongoDB connection
  const mongoURI = process.env.MONGO_URL;
  mongoose.connect(mongoURI);
  const db = mongoose.connection;
  db.once("open", () => console.log("DB successfully connected"));
  db.on("error", (err) => console.log("DB connection failed : ", err));

  await deleteAllUserNotShared();

  db.close();
});

console.log("start");
