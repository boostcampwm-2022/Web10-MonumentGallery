import { model, Schema } from "mongoose";

const keywordScheama = new Schema({
  keyword: { type: String, required: true },
  freq: { type: Number, required: true },
});

const gallerySchema = new Schema({
  theme: { type: String, required: true },
  totalKeywords: [keywordScheama],
  groupKeywords: [
    {
      position: [Number],
      keyword: { type: String, default: "-" },
    },
  ],
  pages: [
    {
      position: [Number],
      keywords: [keywordScheama],
      title: { type: String, default: "-" },
      subtitle: [
        {
          hType: String,
          text: String,
        },
      ],
      links: [
        {
          href: String,
          favicon: String,
        },
      ],
      imagePixel: [[Number]],
    },
  ],
  nodes: [[Number]],
  lastModified: { type: Date, default: new Date() },
  created: { type: Date, default: new Date() },
});

export default model("monument_gallery_dev_lybell", gallerySchema);
