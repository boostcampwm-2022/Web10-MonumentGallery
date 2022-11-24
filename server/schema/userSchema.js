import { model, Schema } from "mongoose";

const userSchema = new Schema({
  userID: { type: String, required: true },
  isShared: { type: Boolean, default: false },
  lastShareModified: { type: Date, default: new Date() },
  lastModified: { type: Date, default: new Date() },
  history: {
    type: Map,
    of: Date,
  },
});

export default model("monument_user_dev_lybell", gallerySchema);