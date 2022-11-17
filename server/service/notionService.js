import { Client } from "@notionhq/client";

const urlRegEx =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

export async function getContentsFromNotion(notionAccessToken, period, theme) {
  const limitTime = getLimitTime(period);
  const notion = new Client({ auth: notionAccessToken });
  const pageContents = {};
  const pageIds = [];
  const prev = Date.now();
  const response = await notion.search({
    filter: { property: "object", value: "page" },
  });
  console.log(`page list 불러오는 시간 ${Date.now() - prev}`);
  const next = Date.now();
  response.results.forEach((result) => {
    console.log(result);
    if (result.object === "page" && Date.parse(result.last_edited_time) > limitTime) {
      pageIds.push(result.id);
      const innerText = getTextFromTextObject(result.properties.title.title[0]);
      if (innerText)
        pageContents[result.id] = {
          title: innerText,
          created_time: result.created_time,
          last_edited_time: result.last_edited_time,
        };
    }
  });
  console.log(`page title 처리 시간 : ${Date.now() - next}`);
  const next2 = Date.now();

  for (let i = 0; i < pageIds.length; i++) {
    pageContents[pageIds[i]] = { ...pageContents[pageIds[i]], ...(await getDataFromPage(notion, pageIds[i])) };
  }

  console.log(`page 처리 로직 총 시간 (불러오기 + 처리) : ${Date.now() - next2}`);

  //토탈 키워드 추가 등등

  const res = {
    theme,
    totalKeywords: {},
    pages: pageContents,
  };

  //DB 저장

  return res;
}

async function getDataFromPage(notion, pageId) {
  const res = {
    position: [],
    node: [], // 페이지간 관계성 표현에 쓰임
    subTitle: [],
    keywords: {},
    links: [],
    imagePixel: [], // 첫번째로 나오는 이미지, 2개이상 [Optional]
  };

  const loading = Date.now();
  const content = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });
  const paragraphs = [];

  console.log(`페이지 컨텐츠 로딩 시간 : ${Date.now() - loading}`);
  const processing = Date.now();
  await content.results.forEach((val) => {

    switch (val.type) {
      case "child_page":
        res.node.push({
          id: val.id,
          title: val.child_page.title,
          created_time: val.created_time,
          last_edited_time: val.last_edited_time,
        });
      case "heading_1":
        if (getTextFromTextObject(val.heading_1?.rich_text[0]))
          res.subTitle.push(getTextFromTextObject(val.heading_1?.rich_text[0]));
        break;
      case "heading_2":
        if (getTextFromTextObject(val.heading_2?.rich_text[0]))
          res.subTitle.push(getTextFromTextObject(val.heading_2?.rich_text[0]));
        break;
      case "heading_3":
        if (getTextFromTextObject(val.heading_3?.rich_text[0]))
          res.subTitle.push(getTextFromTextObject(val.heading_3?.rich_text[0]));
        break;
      case "paragraph":
        if (getTextFromTextObject(val.paragraph?.rich_text[0])) {
          if (urlRegEx.test(getTextFromTextObject(val.paragraph?.rich_text[0]))) {
            getTextFromTextObject(val.paragraph?.rich_text[0])
              .match(urlRegEx)
              .forEach((link) => res.links.push({ href: link, favicon: "" }));
          } else {
            paragraphs.push(getTextFromTextObject(val.paragraph?.rich_text[0]));
          }
        }
        break;
      case "image":
        //file말고 다른 타입도 있으려나
        res.imagePixel.push({
          url: val.image.file.url,
        });
      default:
        break;
    }
  });
  //paragraphs, title, sub-title은 자연어 처리 서버로
  console.log(`페이지 컨텐츠 처리 시간 : ${Date.now() - processing}`);
  return res;
}

function getTextFromTextObject(textObject) {
  return textObject && textObject.plain_text !== undefined ? textObject.plain_text : null;
}

function getLimitTime(period) {
  const twoWeeks = 1209600033;
  if (!period) return 0;
  switch (period) {
    case "2w":
      return Date.now() - twoWeeks;
    case "1m":
      return Date.now() - 2 * twoWeeks;
    case "3m":
      return Date.now() - 6 * twoWeeks;
    case "1y":
      return Date.now() - 24 * twoWeeks;
    default:
      return 0;
  }
}
