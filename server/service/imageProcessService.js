import axios from "axios";

export async function getImagePixelsFromPages(pages, width = 100, height = 100) {
  //기본은 10x10으로 하되, 매개변수에 따라 달라짐
  const res = await Promise.all(
    Object.keys(pages).map(async (pageId) => {
      return {
        ...pages[pageId],
        imagePixel: await getImagePixelFromFastAPI(pages[pageId], width, height),
      };
    }),
  );
  return res;
}

async function getImagePixelFromFastAPI(page, width, height) {
  const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
  if (page.image.length <= 0) return mockData;
  const imageURL = page.image[0];
  //   console.log(imageURL);
  const imagePixel = await axios
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
  return imagePixel;
}

const mockData = [
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
  [0xe2ebf7, 0xd0dff4, 0xb6cff0, 0xb3cdf0, 0x9dbee7, 0x8fb7e6, 0x8db7e7, 0x8cb5e4, 0x92b6e5, 0xa3bde6],
];
