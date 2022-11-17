import express from "express";
import { Client } from "@notionhq/client";
import axios from "axios";
import TestModel from "../model/testSchema.js";
import { getContentsFromNotion } from "../service/notionService.js";

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
  const {period="all", theme="dream"} = req.query;

  res.status(200).json(await getContentsFromNotion(notionAccessToken, period, theme));
  console.log(`총 처리 시간: ${Date.now() - nowTime}`);
});

// FastAPI 연결 확인 test
router.get("/pytest", (req, res) => {
  const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
  axios.get(fastapiEndpoint).then((e) => {
    res.send(e.data);
  });
});

router.get("/error", (req, res) => {
  throw new Error("holy shit");
});

export default router;
