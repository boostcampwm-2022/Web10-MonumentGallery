import { v4 } from "uuid";
import express from "express";
import { Client } from "@notionhq/client";
import axios from "axios";
import TestModel from "../model/testSchema.js";
import { getContentsFromNotion } from "../service/notionService.js";
import galleryMockData from "../model/galleryDummyData.js";

const router = express.Router();

router.get("/testPost", (req, res) => {
  const username = `${Math.floor(Math.random() * 100000)}`;
  TestModel.create({
    username,
    password: "password",
  })
    .then((e) => {
      console.log("success!");
      console.log(e);
      res.json({ result: "success" });
    })
    .catch((e) => {
      console.log("failed!");
      console.log(e);
      res.json({ result: "fail" });
    });
});

router.get("/testGet", async (req, res) => {
  const allData = await TestModel.find();
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

  res.status(200).json(await getContentsFromNotion(notionAccessToken, period, theme));
  console.log(`총 처리 시간: ${Date.now() - nowTime}`);
});

router.get("/gallery/:user/:history", (req, res) => {
  const { user, history } = req.params;
  setTimeout(() => {
    res.json(galleryMockData);
  }, 3000);
});

// FastAPI 연결 확인 test
router.get("/pytest", (req, res) => {
  const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
  axios
    .post(fastapiEndpoint + "/preprocess", mockData)
    .then((e) => {
      res.send(e.data);
    })
    .catch((err) => console.log(err));
});

router.get("/error", (req, res) => {
  throw new Error("holy shit");
});

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
