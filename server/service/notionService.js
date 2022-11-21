import { Client } from "@notionhq/client";

const urlRegEx =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

export async function getContentsFromNotion(notionAccessToken, period, theme) {
  const limitTime = getLimitTime(period);
  const notion = new Client({ auth: notionAccessToken });

  console.log(await getPages(notion, limitTime));
  //   //토탈 키워드 추가 등등

  //   const res = {
  //     theme,
  //     totalKeywords: {},
  //     pages: pageContents,
  //   };

  //   //DB 저장

  //   return res;
}

async function getPages(notion, limitTime) {
  const pageContents = {};
  const pageIds = [];
  //   const prev = Date.now();

  const pageResponse = await notion.search({
    filter: { property: "object", value: "page" },
  });

  //   console.log(`page list 불러오는 시간 ${Date.now() - prev}`);
  const next = Date.now();
  pageResponse.results.forEach((result) => {
    // console.log(result);
    // console.log(result.properties);
    // console.log(result.properties?.title);
    // console.log(result.properties?.keyword?.rich_text);

    if (
      result.object === "page" &&
      result.parent.type !== "database_id" &&
      Date.parse(result.last_edited_time) > limitTime
    ) {
      pageIds.push(result.id);
<<<<<<< HEAD
      const innerText = getTitleFromProperties(result.properties);
      console.log(innerText);
=======
      const innerText = getTextFromTextObject(result.properties.title?.title[0]);
>>>>>>> dev
      if (innerText)
        pageContents[result.id] = {
          title: innerText,
          createdTime: result.created_time,
          lastEditedTime: result.last_edited_time,
        };
    }
  });
  //   console.log(pageContents);
  //   console.log(`page title 처리 시간 : ${Date.now() - next}`);
  //   const next2 = Date.now();

  for (let i = 0; i < pageIds.length; i++) {
    const pageData = await getDataFromPage(notion, pageIds[i]);
    pageContents[pageIds[i]] = await { ...pageContents[pageIds[i]], ...pageData };
    // console.log(await getDataFromPage(notion, pageIds[i]));
  }

  console.log(pageContents);
  let cursor = -1;

  while (++cursor < pageIds.length && pageIds.length < 100) {
    console.log(cursor);
    const cursorId = pageIds[cursor];
    for (let i = 0; i < pageContents[cursorId].childPages.length && pageIds.length < 100; i++) {
      const nowPage = pageContents[cursorId].childPages[i];
      if (nowPage.id in pageContents || nowPage.lastEditedTime > limitTime) continue;
      pageIds.push(nowPage.id);
      pageContents[nowPage.id] = {
        title: nowPage.title,
        createdTime: nowPage.createdTime,
        lastEditedTime: nowPage.lastEditedTime,
        ...(await getDataFromPage(notion, nowPage.id)),
      };
    }
  }

  return pageContents;
}

async function getDataFromPage(notion, pageId) {
  //   const loading = Date.now();
  const content = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });

  //   console.log(`페이지 컨텐츠 로딩 시간 : ${Date.now() - loading}`);
  //   const processing = Date.now();

  //paragraphs, title, sub-title은 자연어 처리 서버로
  //   console.log(`페이지 컨텐츠 처리 시간 : ${Date.now() - processing}`);
  const res = await processPageData(notion, content.results);

  if (res.columnList.length > 0) {
    for (let i = 0; i < res.columnList.length; i++) {
      const columnList = await getColumnFromColumnList(notion, res.columnList[i]);
      Object.keys(columnList).forEach((key) => {
        res[key] = [...res[key], ...columnList[key]];
      });
    }
    delete res.columnList;
  }

  return res;
}

async function processPageData(notion, data) {
  const res = {
    position: [],
    childPages: [], // 자식 페이지들
    heading_1: [],
    heading_2: [],
    heading_3: [],
    links: [],
    image: [], // 첫번째로 나오는 이미지, 2개이상 [Optional]
    texts: [],
    columnList: [],
  };

  await data.forEach(async (val) => {
    console.log(val);
    switch (val.type) {
      case "child_page":
        console.log(val);
        res.childPages.push({
          id: val.id,
          title: val.child_page.title,
          createdTime: val.created_time,
          lastEditedTime: val.last_edited_time,
        });
      case "heading_1":
        if (getTextFromTextObject(val.heading_1?.rich_text))
          res.heading_1.push(getTextFromTextObject(val.heading_1?.rich_text));
        break;
      case "heading_2":
        if (getTextFromTextObject(val.heading_2?.rich_text))
          res.heading_2.push(getTextFromTextObject(val.heading_2?.rich_text));
        break;
      case "heading_3":
        if (getTextFromTextObject(val.heading_3?.rich_text))
          res.heading_3.push(getTextFromTextObject(val.heading_3?.rich_text));
        break;
      case "paragraph":
        res.texts.push(getTextFromTextObject(val.paragraph?.rich_text));
        break;
      case "column_list":
        res.columnList.push(val.id);
        break;
      default:
        // console.log(val);
        break;
    }
  });

  //paragraphs, title, sub-title은 자연어 처리 서버로

  return res;
}

async function getColumnFromColumnList(notion, columnListId) {
  const columns = await notion.blocks.children.list({
    block_id: columnListId,
    page_size: 50,
  });

  const res = {
    position: [],
    childPages: [], // 자식 페이지들
    heading_1: [],
    heading_2: [],
    heading_3: [],
    links: [],
    image: [], // 첫번째로 나오는 이미지, 2개이상 [Optional]
    texts: [],
    columnList: [],
  };

  for (let i = 0; i < columns.results.length; i++) {
    const columnData = await notion.blocks.children.list({
      block_id: columns.results[i].id,
      page_size: 50,
    });
    const processedData = await processPageData(notion, columnData.results);

    Object.keys(processedData).forEach((key) => {
      res[key] = [...res[key], ...processedData[key]];
    });
  }

  return res;
}

function getTitleFromProperties(properties) {
  return Object.keys(properties).reduce((acc, cur) => {
    if (properties[cur]?.type == "title" && properties[cur]?.title.length > 0) {
      acc = properties[cur].title[0].plain_text;
    }
    return acc;
  }, null);
}

function getTextFromTextObject(textObject) {
  if (!textObject?.length || textObject?.length <= 0) return "";
  return textObject[0].plain_text;
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
