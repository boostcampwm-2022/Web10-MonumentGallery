import express from "express";
import { Client } from "@notionhq/client";
import TestModel from "../model/testSchema.js";

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
  const notionAccessToken = req.accessToken;
  const notion = new Client({ auth: notionAccessToken });
  const response = await notion.search({
    filter: { property: "object", value: "page" },
  });
  const pageIds = [];
  response.results.forEach((result) => {
    if (result.object === "page") {
      pageIds.push(result.id);
    }
  });
  const pageContents = [];
  for (let i = 0; i < pageIds.length; i++) {
    const content = await notion.blocks.children.list({
      block_id: pageIds[i],
      page_size: 50,
    });
    pageContents.push(content);
  }
  res.status(200).json(pageContents);
});

// FastAPI 연결 확인 test
router.get("/pytest", (req, res) => {
  const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
  axios.get(fastapiEndpoint).then((e) => {
    res.send(e.data);
  });
});

router.get("/error", (req, res)=>{
  throw new Error("holy shit");
});

export default router;
