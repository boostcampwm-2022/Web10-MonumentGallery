import express from "express";
import axios from "axios";
import TestModel from "../model/testSchema.js";
import { getRawContentsFromNotion } from "../service/getNotionContentService.js";
import galleryMockData from "../model/galleryDummyData.js";
import { processDataFromRawContent } from "../service/dataProcessService.js";
import Gallery from "../schema/gallerySchema.js";
import User from "../schema/userSchema.js";
import { getImagePixelsFromPages } from "../service/imageProcessService.js";
import { createConnectionSSE, endConnectionSSE, writeMessageSSE } from "../service/sseService.js";
import { deleteUserHistory, saveGallery, searchGalleryAll } from "../service/galleryService.js";
import { asyncHandler } from "../utils/utils.js";
import userDummyData from "../model/userDummyData.js";
import galleryDummyData from "../model/galleryDummyData.js";
import { findAllUserRandom } from "../model/userModel.js";
const router = express.Router();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
function getRandomDate() {
  //2022년 12월 5일부터 현 시간까지
  return getRandomInt(1670224522812, Date.now());
}
function makeJsonToBase64(json) {
  return Buffer.from(JSON.stringify(json)).toString("base64").replace(/[=]/g, "");
}

function decodeBase64(base64) {
  return Buffer.from(base64, "base64").toString("utf8");
}

function makeBase64ToBase64URL(base64) {
  return base64.replace(/[+]/g, "-").replace(/[/]/g, "_");
}
function makeBase64URLToBase64(base64URL) {
  return base64URL.replace(/[-]/g, "+").replace(/[_]/g, "/");
}
router.get(
  "/getDataIdx",
  asyncHandler(async (req, res) => {
    const cookieState = req.cookies.searchState ? decodeBase64(makeBase64URLToBase64(req.cookies.searchState)) : null;
    const { searchState, gallerys } = await searchGalleryAll(JSON.parse(cookieState ?? "{}"));
    console.log(gallerys);
    res.cookie("searchState", makeBase64ToBase64URL(makeJsonToBase64(searchState)));
    res.send("good");
  }),
);
router.get(
  "/crontab",
  asyncHandler(async (req, res) => {
    const yesterday = Date.now() - 1000 * 60 * 60 * 24;
    // const users = await User.find({ isShared: false, lastShareModified: { $lte: yesterday } });
    // 대충 일정 수 받았다고 가정
    const users = await User.find();
    // console.log(users);
    await deleteUserHistory(users);
    res.send(await User.find());
  }),
);
router.get(
  "/setdummy",
  asyncHandler(async (req, res) => {
    const tmp = [];
    for (let i = 0; i < 500; i++) tmp.push(i);
    await Promise.all(
      tmp.map(async (val) => {
        const nowUser = userDummyData;
        userDummyData.userID = val.toString();
        userDummyData.userName = val.toString();
        userDummyData.randIdx = getRandomInt(0, 10);
        userDummyData.lastModified = Date.now() - 10000 + getRandomInt(0, 10000);
        userDummyData.isShared = true;
        await User.create(nowUser);
        const galleryID = (await Gallery.create(galleryDummyData))._id.valueOf();
        const history = { [galleryID]: Date.now() };
        await User.findOneAndUpdate({ userID: val }, { history });
        await saveGallery(userDummyData.userID, galleryDummyData);
        return val;
      }),
    );
    // const nowUser = userDummyData;
    // userDummyData.userID = "-2";
    // userDummyData.lastModified = 0;
    // await User.create(nowUser);

    //   for (let j = 0; j < 100; j++) {
    //     await saveGallery(i.toString(), galleryDummyData);
    //   }
    // }
    res.send("good");
  }),
);

router.get("/testShared", (req, res) => {
  res.send({ isShared: true });
});

router.get("/testPost", (req, res) => {
  const username = `${Math.floor(Math.random() * 100000)}`;
  TestModel.create({
    username,
    password: "password",
  })
    .then((e) => {
      console.log("success!");
      console.log(e._id.valueOf());
      res.json({ result: "success", id: e._id.valueOf() });
    })
    .catch((e) => {
      console.log("failed!");
      console.log(e);
      res.json({ result: "fail" });
    });
});

router.get("/testGet", async (req, res) => {
  // const allData = await TestModel.find();
  const allData = await TestModel.findById("637ef089b341ed088fb8913e");
  // TestModel.find()는 Query 객체를 반환하는데 await가 됨. 왜일까
  // Promise 객체를 정말로 상속하는가?
  // 아니면 Promise 프로토콜같은 게 있어서 그걸 따르기만 하면 await를 넣을 수 있는것일까?
  res.json(allData);
});

router.get("/getData", async (req, res) => {
  //duration= 2w||1m||3m||1y
  const notionAccessToken = req.accessToken;
  const nowTime = Date.now();
  const { period = "all", theme = "dream" } = req.query;

  const notionRawContent = await getRawContentsFromNotion(notionAccessToken, period);
  // console.log(notionRawContent);
  const notionContentImage = await getImagePixelsFromPages(notionRawContent);
  console.log(notionContentImage);
  const processedNotionContent = await processDataFromRawContent(notionContentImage, theme);
  // console.log(processedNotionContent);
  // console.log(processedNotionContent.pages);

  // await Gallery.create(processedNotionContent)
  //   .then((e) => {
  //     console.log("success");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     console.log("failed");
  //   });

  const allData = await Gallery.find();
  console.log(allData);

  res.status(200).json(processedNotionContent);
  console.log(`총 처리 시간: ${Date.now() - nowTime}`);
});

router.get("/gallery/:user/:history", (req, res) => {
  const { user, history } = req.params;
  setTimeout(() => {
    const themeList = ["DREAM", "SPRING", "SUMMER", "AUTUMN", "WINTER"];
    const idx = parseInt(Math.random() * themeList.length);
    const theme = themeList[idx];
    galleryMockData.theme = theme;
    return res.json(galleryMockData);
  }, 3000);
});

// FastAPI 연결 확인 test
router.get("/pytest/text", (req, res) => {
  const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
  axios
    .post(fastapiEndpoint + "/preprocess/text", mockData)
    .then((e) => {
      res.send(e.data);
    })
    .catch((err) => console.log(err));
});
router.get("/pytest/image", (req, res) => {
  const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
  axios
    .post(fastapiEndpoint + "/preprocess/image", mockImageUrlData)
    .then((e) => {
      res.send(e.data);
    })
    .catch((err) => console.log(err));
});

const sse = {};

router.get("/sse/integration/:id", (req, res) => {
  getConnectionSSE(req.params.id, res);
  setTimeout(() => {
    writeMessageSSE(req.params.id, "hi");
  }, 1000);
  setTimeout(() => {
    endConnectionSSE(req.params.id);
  }, 2000);
});

router.get("/sse/connection/:id", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  sse[req.params.id] = res;

  res.write("connected\n\n");
});

router.get("/sse/:id", (req, res) => {
  setTimeout(() => {
    sse[req.params.id].write("hello\n\n");
  }, 1000);
  setTimeout(() => {
    sse[req.params.id].write("hello2\n\n");
  }, 2000);
  setTimeout(() => {
    sse[req.params.id].write("hello3\n\n");
  }, 3000);
  setTimeout(() => {
    sse[req.params.id].write("hello4\n\n");
  }, 4000);
  setTimeout(() => {
    sse[req.params.id].write("end\n\n");
    sse[req.params.id].end();
  }, 5000);
  res.send("success");
  // const id = new Date().toLocaleTimeString();
  // Sends a SSE every 3 seconds on a single connection.
  // setInterval(function () {
  //   emitSSE(res, id, new Date().toLocaleTimeString());
  // }, 3000);

  // emitSSE(res, id, new Date().toLocaleTimeString());
});
let clients = [];
function eventsHandler(request, response, next) {
  const { period, theme } = request.query;
  console.log("test:", period, theme);
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    charset: "UTF-8",
    "Transfer-Encoding": "chunked",
  };
  response.writeHead(200, headers);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  console.log(`${clientId} Connection opened!`);

  request.on("close", () => {
    console.log(`${clientId} Connection closed!`);
    clients = clients.filter((client) => client.id !== clientId);
  });
  setTimeout(() => {
    const response = {
      kind: "노션에서 데이터 가져오기",
      progress: 10,
      data: {},
    };
    clients.forEach((client) => {
      client.response.write(`data: ${JSON.stringify(response)}\n\n`);
    });
  }, 1000);
  setTimeout(() => {
    const response = {
      kind: "자연어 처리하기",
      progress: 40,
      data: {},
    };
    clients.forEach((client) => {
      client.response.write(`data: ${JSON.stringify(response)}\n\n`);
    });
  }, 3000);
  setTimeout(() => {
    const response = {
      kind: "DB에 저장하기",
      progress: 70,
      data: {},
    };
    clients.forEach((client) => {
      client.response.write(`data: ${JSON.stringify(response)}\n\n`);
    });
  }, 5000);
  setTimeout(() => {
    const response = {
      kind: "완료",
      progress: 100,
      data: { page: "/gallery/a3fb0ee0-7379-4ae7-aada-c4eff877c0de/903c2514-3ddc-4d20-9daf-06577bcd7b15" },
    };
    clients.forEach((client) => {
      client.response.write(`data: ${JSON.stringify(response)}\n\n`);
    });
  }, 7000);
}

router.get("/sse", eventsHandler);

export default router;

const mockData = {
  pages: {
    e123: {
      title: "기술공유 발표 준비 - 세연",
      h1: [
        "상태관리 라이브러리 zustand 를 이용한 토스트 구현하기.",
        "번외: 추가적인 문제 해결-토스트가 2개씩 사라지는 버그(feat.기종)",
      ],
      h2: [
        "zustand 란? ",
        "장점",
        "zustand 사용하기전 상황 (useState로 관리했을 때)",
        "zustand 도입",
        "배경상황",
        "원인",
        "해결방법",
        "결론",
      ],
      h3: [
        "토스트 체험하러 가기 → https://monumentgallery.ddns.net/myspace",
        "여러 상태관리 라이브러리 중 zustand를 고른 이유",
        "useState로 관리했을 때의 문제점 ",
        "전역 상태관리를 하게되면서 느낀 장점",
        "버그가 난 코드 원본",
        "해결방법 원본 코드",
        "zustand 써보세요! 😆",
        "상태관리 라이브러리를 쓸 때는 .splice 등으로 객체 상태를 직접 수정하면 안 됩니다!",
      ],
      paragraph: [
        "Zustand는 독일어로 '상태'라는 뜻을 가진 라이브러리이며 Jotai를 만든 ",
        "등 이것들 이외에도 다른 장점들도 많다고 합니다..!",
        "저희 조는 ",
        "리액트에서 토스트는 ",
        "처음에는 이 라이브러리를 그냥 가져다 써서 적용을 할까 생각을 하였지만, 프로젝트를 하는 목표가 ",
        "구현 내용을 요약해서 설명하면,",
        "구현이 끝나고 난 뒤 프로젝트에 적용을 하면서 느낀 불편한 점은, ",
        "토스트",
        "예를 들어 로그인 오류 시에 띄워주거나, 금지된 동작을 하였을 때 띄워주거나, 로딩이 완료되었을 때 띄워주는 등 여러 컴포넌트 내에서 ",
        "따라서 ",
        "토스트",
        "그래서 현재 바뀐 코드는 ",
        "위의 코드처럼 토스트를 ",
        "코드의 관심사도 ",
      ],
    },
    e456: {
      title: "기술공유 발표 준비2 - 세연2",
      h1: [
        "상태관리 라이브러리 zustand 를 이용한 토스트 구현하기.",
        "번외: 추가적인 문제 해결-토스트가 2개씩 사라지는 버그(feat.기종)",
      ],
      h2: [
        "zustand 란? ",
        "장점",
        "zustand 사용하기전 상황 (useState로 관리했을 때)",
        "zustand 도입",
        "배경상황",
        "원인",
        "해결방법",
        "결론",
      ],
      h3: [
        "토스트 체험하러 가기 → https://monumentgallery.ddns.net/myspace",
        "여러 상태관리 라이브러리 중 zustand를 고른 이유",
        "useState로 관리했을 때의 문제점 ",
        "전역 상태관리를 하게되면서 느낀 장점",
        "버그가 난 코드 원본",
        "해결방법 원본 코드",
        "zustand 써보세요! 😆",
        "상태관리 라이브러리를 쓸 때는 .splice 등으로 객체 상태를 직접 수정하면 안 됩니다!",
      ],
      paragraph: [
        "Zustand는 독일어로 '상태'라는 뜻을 가진 라이브러리이며 Jotai를 만든 ",
        "등 이것들 이외에도 다른 장점들도 많다고 합니다..!",
        "저희 조는 ",
        "리액트에서 토스트는 ",
        "처음에는 이 라이브러리를 그냥 가져다 써서 적용을 할까 생각을 하였지만, 프로젝트를 하는 목표가 ",
        "구현 내용을 요약해서 설명하면,",
        "구현이 끝나고 난 뒤 프로젝트에 적용을 하면서 느낀 불편한 점은, ",
        "토스트",
        "예를 들어 로그인 오류 시에 띄워주거나, 금지된 동작을 하였을 때 띄워주거나, 로딩이 완료되었을 때 띄워주는 등 여러 컴포넌트 내에서 ",
        "따라서 ",
        "토스트",
        "그래서 현재 바뀐 코드는 ",
        "위의 코드처럼 토스트를 ",
        "코드의 관심사도 ",
      ],
    },
  },
};

const mockImageUrlData = {
  url: "https://img.animalplanet.co.kr/news/2019/08/10/700/v4q0b0ff4hcpew1g6t39.jpg",
  width: 50,
  height: 50,
};
