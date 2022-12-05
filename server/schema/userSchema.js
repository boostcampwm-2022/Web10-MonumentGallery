import { model, Schema } from "mongoose";
//필요한 인덱스
//userID
//(lastShareModified, isShared) vs (isShared, lastShareModified)

const userSchema = new Schema({
  userID: { type: String, required: true, unique: true },
  isShared: { type: Boolean, default: false },
  randIdx: { type: Number, default: 0 },
  lastShareModified: { type: Date, default: new Date() },
  lastModified: { type: Date, default: new Date() },
  history: {
    type: Map,
    of: Date,
  },
});

export default model("monument_user_dev_lybell", userSchema);
