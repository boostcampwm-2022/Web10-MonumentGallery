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
      keywords: { type: Map, of: Number, required: true },
      title: { type: String, default: "-" },
      subTitle: [
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

export default model("myDBGalleryTest", gallerySchema);
