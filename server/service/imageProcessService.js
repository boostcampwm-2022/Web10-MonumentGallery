import axios from "axios";

export async function getImagePixelsFromPages(pages, width = 10, height = 10) {
  //기본은 10x10으로 하되, 매개변수에 따라 달라짐
  const res = await Promise.all(
    Object.keys(pages).map(async (pageId) => {
      return {
        ...pages[pageId],
        imagePixel: await getImagePixelsFromFastAPI(pages[pageId], width, height),
      };
    }),
  );
  return res;
}

async function getImagePixelsFromFastAPI(page, width, height) {
  const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
  if (page.image.length <= 0) return mockData;
  const imageURL = page.image[0];
  //   console.log(imageURL);
  const imagePixels = await axios
    .post(fastapiEndpoint + "/preprocess/image", {
      url: imageURL,
      width: width,
      height: height,
    })
    .then((e) => {
      //   console.log(e);
      //   console.log(e.data);
      return e.data;
    })
    .catch((err) => {
      console.log(imageURL, "이미지 처리 에러");
      return mockData;
    });
  return imagePixels;
}

const mockData = [
  [
    "0xe2ebf7",
    "0xd0dff4",
    "0xb6cff0",
    "0xb3cdf0",
    "0x9dbee7",
    "0x8fb7e6",
    "0x8db7e7",
    "0x8cb5e4",
    "0x92b6e5",
    "0xa3bde6",
  ],
  [
    "0xf6f6f9",
    "0xf7f8f8",
    "0xe1e8f6",
    "0xeaeef9",
    "0xb6b0c5",
    "0x898fac",
    "0x9bb3d6",
    "0x9ebee7",
    "0xb0c6e9",
    "0xc8d3eb",
  ],
  [
    "0xe7eaf8",
    "0xebeef8",
    "0xf4f6fa",
    "0xeeedf3",
    "0x8b7380",
    "0x614a58",
    "0x8b7983",
    "0x96a4c4",
    "0xc9d8f0",
    "0xdee0ee",
  ],
  [
    "0xe4ebf9",
    "0xd9e7f7",
    "0xcde4f9",
    "0xbdc6db",
    "0x60454f",
    "0x4b2d30",
    "0x876d6a",
    "0xb7c4da",
    "0xb7cfee",
    "0xd2d8eb",
  ],
  [
    "0xecf0f8",
    "0xeff1f7",
    "0xf1f5fb",
    "0xc0bfcb",
    "0x74575b",
    "0x5a3838",
    "0x785252",
    "0xcac9d7",
    "0xcfddf2",
    "0xdde1ef",
  ],
  [
    "0xdfecf9",
    "0xe5ecf7",
    "0xeef6fc",
    "0xa89aa0",
    "0x603b3b",
    "0x67403d",
    "0x754545",
    "0xd7cdd6",
    "0xe4e7f5",
    "0xd9dcea",
  ],
  [
    "0xedf1f9",
    "0xe0eefb",
    "0xd9efff",
    "0xa89799",
    "0x5c3a33",
    "0x371d1e",
    "0x805b5b",
    "0xe1dfe9",
    "0xdee0ef",
    "0xd4d6e4",
  ],
  [
    "0xeaeef9",
    "0xecf1fb",
    "0xd1dae5",
    "0xb4958e",
    "0xb28877",
    "0x9c7365",
    "0xc0b5b8",
    "0xe0e9f7",
    "0xd7dbeb",
    "0xd1d5e6",
  ],
  [
    "0xd5d9e0",
    "0xebecf6",
    "0xc3aba9",
    "0xc39c8f",
    "0xc6a296",
    "0xcebebb",
    "0xdde4f2",
    "0xd7e2f2",
    "0xdce3f4",
    "0xdbe0f2",
  ],
  [
    "0x86887a",
    "0xc5b4b4",
    "0xc39e91",
    "0xcca592",
    "0xd0b7af",
    "0xe2e5ed",
    "0xdee1ed",
    "0xdaddec",
    "0xdfe3f1",
    "0xe0e3f2",
  ],
];
