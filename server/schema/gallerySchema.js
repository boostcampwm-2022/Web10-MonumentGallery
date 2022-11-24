import { model, Schema } from "mongoose";

const gallerySchema = new Schema({
  theme: { type: String, required: true },
  totalKeywords: {
    type: Map,
    of: Number,
    required: true,
  },
  pages: [
    {
      position: [Number],
      keywords: { type: Map, of: Number, default: "-" },
      title: { type: String, required: true },
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
