import { IGalleryMapData } from "../@types/gallery";

// dummy data
const dummyData: IGalleryMapData = {
  theme: "SPRING",
  totalKeywords: {
    부스트캠프: 2,
    쏜애플: 3,
    사랑해요: 1,
    네이버: 4,
    카카오: 4,
    취직: 2,
  },
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
        { text: "이것은 h1타이틀", hType: "h1" },
        { text: "긴 제목은 흘러내립니다", hType: "h1" },
        { text: "쏜애플 사랑해요요요", hType: "h2" },
        {
          text: "가나다라마바사아자차카타파하ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          hType: "h2",
        },
        {
          text: "별빛바다",
          hType: "h2",
        },
        {
          text: "기억",
          hType: "h2",
        },
        {
          text: "별",
          hType: "h3",
        },
      ],
      keywords: {
        three: 5,
        javascript: 4,
        data: 4,
        awesome: 3,
        blitz: 3,
        thornapple: 3,
        nova: 2,
        lybell: 8,
        stardew: 4,
        valley: 4,
        starlight: 2,
        micro: 1,
        architecture: 1,
        holy: 1,
        hey: 5,
        harvard: 4,
        help: 4,
        me: 3,
        threejs: 3,
        reactThreeFiber: 3,
        merri: 2,
        core: 4,
        keeper: 4,
        devOps: 2,
        helloWorld: 1,
      },
      links: [
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
      ],
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
        { text: "이것은 h1타이틀", hType: "h1" },
        { text: "이것도 h1타이틀", hType: "h1" },
        { text: "쏜애플 사랑해요", hType: "h2" },
      ],
      keywords: {
        부스트캠프: 2,
        쏜애플: 3,
        사랑해요: 1,
      },
    },
    {
      position: [-20, 0],
      title: "이것은 3번째 타이틀이다",
      subtitle: [
        { text: "이것은 h1타이틀", hType: "h1" },
        { text: "이것도 h1타이틀", hType: "h1" },
        { text: "쏜애플 사랑해요", hType: "h2" },
      ],
      keywords: {
        부스트캠프: 2,
        쏜애플: 3,
        사랑해요: 1,
      },
    },
    {
      position: [0, -20],
      title: "이것은 4번째 타이틀이다",
      subtitle: [
        { text: "이것은 h1타이틀", hType: "h1" },
        { text: "이거는 h2타이틀", hType: "h2" },
        { text: "쏜애플 사랑해요", hType: "h2" },
      ],
      keywords: {
        부스트캠프: 2,
        쏜애플: 3,
        사랑해요: 1,
      },
      links: [
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
        { href: "https://www.naver.com" },
      ],
    },
    {
      position: [40, 0],
      title: "이것은 첫번쨰랑 이어진 타이틀이다",
      subtitle: [{ text: "부스트캠프 사랑해요", hType: "h2" }],
      keywords: {
        부스트캠프: 1,
        사랑해요: 1,
      },
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

export default dummyData;
