import { model, Schema } from "mongoose";
// test model

const testSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
});

export default model("myDBTest", testSchema);
