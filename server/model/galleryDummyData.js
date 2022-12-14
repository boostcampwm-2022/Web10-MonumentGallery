// dummy data
export default {
  // uuid: "#24adaf",
  theme: "DREAM",
  // totalKeywords: {
  //   부스트캠프: 2,
  //   쏜애플: 3,
  //   사랑해요: 1,
  //   네이버: 4,
  //   카카오: 4,
  //   취직: 2,
  // },
  totalKeywords: [
    {
      keyword: "부스트캠프",
      freq: 1,
    },
    {
      keyword: "CSS",
      freq: 1,
    },
    {
      keyword: "Monument",
      freq: 1,
    },
  ],
  groupKeywords: [
    { position: [20, 0], keyword: "1번방향" },
    { position: [0, 20], keyword: "2번방향" },
    { position: [-20, 0], keyword: "3번방향" },
    { position: [0, -20], keyword: "4번방향" },
  ],
  pages: [
    {
      position: [20, 0],
      title: "이것은 타이틀이다",
      subtitle: [
        { text: "이것은 h1타이틀", type: "h1" },
        { text: "이것도 h1타이틀", type: "h1" },
        { text: "쏜애플 사랑해요", type: "h2" },
      ],
      // keywords: {
      //   부스트캠프: 2,
      //   쏜애플: 3,
      //   사랑해요: 1,
      // },
      keywords: [
        {
          keyword: "부스트캠프",
          freq: 1,
        },
      ],
      links: {
        href: "https://www.naver.com",
      },
      imagePixel: [
        [0xff0000, 0xff2200, 0xff4400, 0xff6600, 0xff8800, 0xffaa00, 0xffcc00, 0xffff00],
        [0xcc0000, 0xcc2200, 0xcc4400, 0xcc6600, 0xcc8800, 0xccaa00, 0xcccc00, 0xccff00],
        [0x990000, 0x992200, 0x994400, 0x996600, 0x998800, 0x99aa00, 0x99cc00, 0x99ff00],
        [0x660000, 0x662200, 0x664400, 0x666600, 0x668800, 0x66aa00, 0x66cc00, 0x66ff00],
        [0x330000, 0x332200, 0x334400, 0x336600, 0x338800, 0x33aa00, 0x33cc00, 0x33ff00],
        [0x000000, 0x002200, 0x004400, 0x006600, 0x008800, 0x00aa00, 0x00cc00, 0x00ff00],
      ],
    },
    {
      position: [0, 20],
      title: "이것은 2번째 타이틀이다",
      subtitle: [
        { text: "이것은 h1타이틀", type: "h1" },
        { text: "이것도 h1타이틀", type: "h1" },
        { text: "쏜애플 사랑해요", type: "h2" },
      ],
      // keywords: {
      //   부스트캠프: 2,
      //   쏜애플: 3,
      //   사랑해요: 1,
      // },
      keywords: [
        {
          keyword: "부스트캠프",
          freq: 1,
        },
      ],
    },
    {
      position: [-20, 0],
      title: "이것은 3번째 타이틀이다",
      subtitle: [
        { text: "이것은 h1타이틀", type: "h1" },
        { text: "이것도 h1타이틀", type: "h1" },
        { text: "쏜애플 사랑해요", type: "h2" },
      ],
      // keywords: {
      //   부스트캠프: 2,
      //   쏜애플: 3,
      //   사랑해요: 1,
      // },
      keywords: [
        {
          keyword: "부스트캠프",
          freq: 1,
        },
      ],
    },
    {
      position: [0, -20],
      title: "이것은 4번째 타이틀이다",
      subtitle: [
        { text: "이것은 h1타이틀", type: "h1" },
        { text: "이거는 h2타이틀", type: "h2" },
        { text: "쏜애플 사랑해요", type: "h2" },
      ],
      // keywords: {
      //   부스트캠프: 2,
      //   쏜애플: 3,
      //   사랑해요: 1,
      // },
      keywords: [
        {
          keyword: "부스트캠프",
          freq: 1,
        },
      ],
    },
    {
      position: [40, 0],
      title: "이것은 첫번쨰랑 이어진 타이틀이다",
      subtitle: [{ text: "부스트캠프 사랑해요", type: "h2" }],
      //   keywords: {
      //     부스트캠프: 1,
      //     사랑해요: 1,
      //   },
      keywords: [
        {
          keyword: "부스트캠프",
          freq: 1,
        },
      ],
    },
  ],
  nodes: [
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [-1, 3],
    [0, 4],
  ],
};
