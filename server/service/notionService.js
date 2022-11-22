import { Client } from "@notionhq/client";

//url 탐지
const urlRegEx =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

export async function getContentsFromNotion(notionAccessToken, period, theme) {
  const limitTime = getLimitTime(period);
  const notion = new Client({ auth: notionAccessToken });

  console.log(await getPages(notion, limitTime));

  // 자연어 처리 서버 api 호출
  // 토탈 키워드 추가 등등

  //   const res = {
  //     theme,
  //     totalKeywords: {},
  //     pages: pageContents,
  //   };

  // DB 저장

  // return res;
}

async function getPages(notion, limitTime) {
  const pageContents = {};
  const pageIds = [];

  //root page 처리
  const pageResponse = await notion.search({
    filter: { property: "object", value: "page" },
  });

  const next = Date.now();
  pageResponse.results.forEach(async (result) => {
    if (
      result.object === "page" &&
      result.parent.type === "workspace" &&
      Date.parse(result.last_edited_time) > limitTime
    ) {
      pageIds.push(result.id);
      const innerText = getTitleFromProperties(result.properties);
      console.log(innerText);
      if (innerText)
        pageContents[result.id] = {
          type: "page",
          title: innerText,
          createdTime: result.created_time,
          lastEditedTime: result.last_edited_time,
        };
    }
  });

  //root 데이터베이스 처리
  const databaseResponse = await notion.search({
    filter: { property: "object", value: "database" },
  });

  databaseResponse.results.forEach(async (result) => {
    if (
      result.object === "database" &&
      result.parent.type === "workspace" &&
      Date.parse(result.last_edited_time) > limitTime
    ) {
      pageIds.push(result.id);
      pageContents[result.id] = {
        type: "database",
        title: getTextFromTextObject(result?.title),
        createdTime: result.created_time,
        lastEditedTime: result.last_edited_time,
      };
    }
  });

  //rootPage들 정보 추가
  for (let i = 0; i < pageIds.length; i++) {
    const pageData =
      pageContents[pageIds[i]].type === "page"
        ? await getDataFromPage(notion, pageIds[i])
        : await getDataFromDatabase(notion, pageIds[i]);
    pageContents[pageIds[i]] = { ...pageContents[pageIds[i]], ...pageData };
  }

  console.log(pageContents);

  //자식 페이지들 재귀탐색 (100개까지만 => 대략 1분 걸림)
  let cursor = -1;

  while (++cursor < pageIds.length && pageIds.length < 100) {
    console.log(cursor);
    const cursorId = pageIds[cursor];
    for (let i = 0; i < pageContents[cursorId].childPage.length && pageIds.length < 100; i++) {
      const nowPage = pageContents[cursorId].childPage[i];
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
  const content = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });

  const res = processPageData(notion, content.results);

  //columnList 처리
  if (res.columnList.length > 0) {
    for (let i = 0; i < res.columnList.length; i++) {
      const columnList = await getDataFromColumnList(notion, res.columnList[i]);
      Object.keys(columnList).forEach((key) => {
        res[key] = [...res[key], ...columnList[key]];
      });
    }
    delete res.columnList;
  }

  //자식 데이터베이스 처리
  if (res.childDatabase.length > 0) {
    for (let i = 0; i < res.childDatabase.length; i++) {
      const childDatabase = await notion.databases.retrieve({ database_id: res.childDatabase[i] });

      //is_inline에 따라 다르게 처리
      if (!childDatabase.is_inline) {
        //인라인이 아닐 경우 -> 페이지로 간주
        res.childPage.push({
          type: "database",
          id: res.childDatabase[i],
          title: getTextFromTextObject(childDatabase?.title),
          createdTime: childDatabase.created_time,
          lastEditedTime: childDatabase.last_edited_time,
        });
      } else {
        //인라인일 경우 -> 부모 페이지에 종속, 제목 -> h3, 페이지들 -> texts
        res.heading_3.push(getTextFromTextObject(childDatabase?.title));
        const databaseData = await notion.databases.query({
          database_id: childDatabase.id,
        });
        databaseData.results.forEach((data) => {
          res.texts.push(getTitleFromProperties(data.properties));
        });
      }
    }
  }

  return res;
}

function processPageData(notion, data) {
  // 다른 함수들과 res의 형식이 강결합돼있으므로 여기 수정 시 모두 수정해야함
  const res = {
    position: [],
    childPage: [], // 자식 페이지들
    h1: [],
    h2: [],
    h3: [],
    links: [],
    image: [], // 첫번째로 나오는 이미지, 2개이상 [Optional]
    paragraph: [], // paragraph, list, toggle등등
    columnList: [],
    childDatabase: [],
  };

  data.forEach((val) => {
    switch (val.type) {
      case "child_page":
        res.childPage.push({
          type: "page",
          id: val.id,
          title: val.child_page.title,
          createdTime: val.created_time,
          lastEditedTime: val.last_edited_time,
        });
        break;
      case "child_database":
        res.childDatabase.push(val.id);
        break;
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
        if (getTextFromTextObject(val.paragraph?.rich_text))
          if (urlRegEx.test(getTextFromTextObject(val.paragraph?.rich_text))) {
            getTextFromTextObject(val.paragraph?.rich_text)
              .match(urlRegEx)
              .forEach((link) => res.links.push({ href: link, favicon: "" }));
          } else {
            res.texts.push(getTextFromTextObject(val.paragraph?.rich_text));
          }
        break;
      case "column_list":
        res.columnList.push(val.id);
        break;
      default:
        // console.log(val.type);
        break;
    }
  });

  return res;
}
async function getDataFromDatabase(notion, databaseId) {
  const res = {
    position: [],
    childPage: [], // 자식 페이지들
    h1: [],
    h2: [],
    h3: [],
    links: [],
    image: [], // 첫번째로 나오는 이미지, 2개이상 [Optional]
    paragraph: [],
    columnList: [],
    childDatabase: [],
  };
  const database = await notion.databases.retrieve({ database_id: databaseId });

  //database.description 처리 필요

  const databaseChildPage = await notion.databases.query({
    database_id: databaseId,
  });
  databaseChildPage.results.forEach((data) => {
    res.childPage.push({
      type: "page",
      id: data.id,
      title: getTitleFromProperties(data.properties),
      createdTime: data.created_time,
      lastEditedTime: data.last_edited_time,
    });
  });

  return res;
}

async function getDataFromColumnList(notion, columnListId) {
  // 컬럼 리스트 처리, 정보 접근하려면 블럭 요소를 탐색해야 해서 processPageData 사용
  const columns = await notion.blocks.children.list({
    block_id: columnListId,
    page_size: 50,
  });

  const res = {
    position: [],
    childPage: [], // 자식 페이지들
    h1: [],
    h2: [],
    h3: [],
    links: [],
    image: [], // 첫번째로 나오는 이미지, 2개이상 [Optional]
    paragraph: [],
    columnList: [],
    childDatabase: [],
  };

  for (let i = 0; i < columns.results.length; i++) {
    const columnData = await notion.blocks.children.list({
      block_id: columns.results[i].id,
      page_size: 50,
    });
    const processedData = processPageData(notion, columnData.results);

    Object.keys(processedData).forEach((key) => {
      res[key] = [...res[key], ...processedData[key]];
    });
  }

  return res;
}

function getTitleFromProperties(properties) {
  //properties에서 title 타입을 찾아서 plain_text반환
  return Object.keys(properties).reduce((acc, cur) => {
    if (properties[cur]?.type == "title" && properties[cur]?.title.length > 0) {
      acc = properties[cur].title[0].plain_text;
    }
    return acc;
  }, null);
}

function getTextFromTextObject(textObject) {
  //text요소에서 plain_text 찾아서 반환, 데이터베이스의 descriptions 때문에 추후 배열형태로 읽어들일 필요가 있을지도..
  if (!textObject?.length || textObject?.length <= 0) return "";
  return textObject[0].plain_text;
}

function getLimitTime(period) {
  //제한시간
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
