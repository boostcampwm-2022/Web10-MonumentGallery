import { model, Schema } from "mongoose";

const keywordScheama = new Schema({
  keyword: { type: String, required: true },
  freq: { type: Number, required: true },
});

const gallerySchema = new Schema({
  theme: { type: String, required: true },
  totalKeywords: [keywordScheama],
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
    },
  ],
  nodes: [[Number]],
});

export default model("monument_gallery_dev_lybell", gallerySchema);
