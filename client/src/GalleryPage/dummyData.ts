import { IGalleryMapData } from "../@types/gallery";

// dummy data
const dummyData: IGalleryMapData = {
  id: "TUTORIAL",
  theme: "SPRING",
  userName: "튜토리얼",
  totalKeywords: {
    자세한: 4,
    사용방법은: 7,
    날라다니는: 5,
    표지판을: 10,
    클릭하세요: 6,
  },
  groupKeywords: [
    { position: [20, 0], keyword: "사진 섬" },
    { position: [0, 20], keyword: "제목 섬" },
    { position: [-20, 0], keyword: "키워드 섬" },
    { position: [0, -20], keyword: "링크 섬" },
  ],
  pages: [
    {
      position: [20, 0],
      title: "사진파편을 클릭해보세요",
      subtitle: [],
      keywords: {},
      links: [],
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
      title: "페이지 섬에 가까이 가면 제목과 소제목이 보입니다",
      subtitle: [
        { text: "소제목입니다", hType: "h1" },
        { text: "길이가 긴 소제목은 흘러내립니다", hType: "h1" },
        { text: "짧은 소제목입니다", hType: "h2" },
        {
          text: "부스트캠프화이팅",
          hType: "h2",
        },
      ],
      keywords: {},
    },
    {
      position: [-20, 0],
      title: "섬 주위를 돌고 있는 건 페이지 내 키워드들입니다.",
      subtitle: [],
      keywords: {
        조은: 5,
        황준일: 5,
        송요창: 5,
        한기종: 4,
        이정욱: 4,
        이종찬: 4,
        고세연: 4,
        이학균: 4,
        부스트캠프: 3,
        "조이(Zoey)": 3,
        이지: 3,
        MC: 3,
        지니: 3,
        "루시(Lucy)": 3,
      },
    },
    {
      position: [0, -20],
      title: "하얀 사각형에 접근하면 페이지 내 링크로 이동할 수 있습니다. ",
      subtitle: [],
      keywords: {},
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
      title: "사진섬페이지와 연결된 페이지섬입니다",
      subtitle: [{ text: "부스트캠프 여러분 수고하셨습니다", hType: "h2" }],
      keywords: {},
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
