import mongoose from "mongoose";
import dotenv from "dotenv";
import { deleteByID } from "./model/galleryModel.js";
import {
  deleteUserHistoryByID,
  findAllUserNotShared,
} from "./model/userModel.js";

async function deleteUserHistory(user) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Promise.all(
      user.history.forEach(async (val, key) => {
        if (!(await deleteByID(key)))
          throw new Error(`${user._id} : ${key} 갤러리를 찾을 수 없습니다.`);
        return key;
      })
    );

    if (!(await deleteUserHistoryByID(user._id)))
      throw new Error(`${user._id} 존재하지 않는 유저입니다.`);

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
}

async function deleteAllUserNotShared() {
  let skip = 0;
  let isStart = true;
  let users = [];

  while (isStart || users.length == 20) {
    isStart = false;
    users = await findAllUserNotShared(skip, 20);

    await Promise.all(
      users.map(async (user) => {
        await deleteUserHistory(user);
        return user._id;
      })
    );
  }

  console.log("complete");
}

async function main() {
  dotenv.config();

  // mongoDB connection
  const mongoURI = process.env.MONGO_URL;
  mongoose.connect(mongoURI);
  const db = mongoose.connection;
  db.once("open", () => console.log("DB successfully connected"));
  db.on("error", (err) => console.log("DB connection failed : ", err));
  await deleteAllUserNotShared();
}

main();
