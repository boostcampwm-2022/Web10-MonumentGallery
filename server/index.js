import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import TestModel from "./model/testSchema.js";

dotenv.config();
const app = express();
const port = 3000;

const mongoURI = process.env.mongo_url;
await mongoose.connect(mongoURI);
const db = mongoose.connection;
db.once('open', ()=>console.log("DB successfully connected"));
db.on('error',(err)=>console.log("DB connection failed : ", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("data");
});

app.get("/testPost", (req, res)=>{
  const username = `${Math.floor(Math.random()*100000)}`;
  TestModel.create({
    username,
    password: "password",
  }).then( e=>{
    console.log("success!");
    console.log(e);
    res.json({result:"success"});
  } ).catch( e=>{
    console.log("failed!");
    console.log(e);
    res.json({result:"fail"});
  });
});

app.get("/testGet", async (req, res)=>{
  const allData = await TestModel.find();
  // TestModel.find()는 Query 객체를 반환하는데 await가 됨. 왜일까
  // Promise 객체를 정말로 상속하는가?
  // 아니면 Promise 프로토콜같은 게 있어서 그걸 따르기만 하면 await를 넣을 수 있는것일까?
  console.log(allData);
  res.json({result:"test"});
});