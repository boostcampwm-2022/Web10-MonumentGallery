import { Client } from "@notionhq/client";
//notion의 데이터를 불러오는 로직

//url 탐지

const urlRegEx =
  // eslint-disable-next-line max-len, no-useless-escape
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gim;

export async function getRawContentsFromNotion(notionAccessToken, period) {
  //deprecated
  const limitTime = getLimitTime(period);
  const notion = new Client({ auth: notionAccessToken });

  return await getPages(notion, limitTime);
}

function getPageBasic(result, type) {
  let innerText;
  if (type === "page") {
    innerText = getTitleFromProperties(result.properties) ? getTitleFromProperties(result.properties) : "-";
  } else {
    innerText = getTextFromTextObject(result?.title).length > 0 ? getTextFromTextObject(result?.title)[0] : "-";
  }
  return {
    type: type,
    id: result.id,
    title: innerText,
    createdTime: result.created_time,
    lastEditedTime: result.last_edited_time,
    myUrl: result.url,
  };
}

export function sumObject(obj1, obj2) {
  const links = [...obj2.links];
  if (obj1.myUrl) links.push({ href: obj1.myUrl, favicon: "" });

  //obj1이 기준임
  return {
    id: obj1?.id,
    title: obj1?.title,
    createdTime: obj1?.createdTime,
    lastEditedTime: obj1?.lastEditedTime,
    position: obj2?.position,
    childPage: obj2?.childPage,
    childDatabase: obj2?.childDatabase,
    columnList: obj2?.columnList,
    h1: obj2?.h1,
    h2: obj2?.h2,
    h3: obj2?.h3,
    links: links,
    image: obj2?.image,
    paragraph: obj2?.paragraph,
  };
}
function changeArrayToObject(ary) {
  return ary.reduce((acc, cur) => {
    if (cur?.id) acc[cur.id] = cur;
    return acc;
  }, {});
}

async function getPageDetail(notion, pageContent) {
  return await Promise.all(
    pageContent.map(async (page) => {
      return sumObject(
        page,
        page.type === "page" ? await getDataFromPage(notion, page.id) : await getDataFromDatabase(notion, page.id),
      );
    }),
  );
}
async function getRootPage(notion, limitTime, type) {
  const pageResponse = await notion.search({
    filter: { property: "object", value: type },
  });

  const pageContent = pageResponse.results
    .filter(
      (result) =>
        result.object === type &&
        result.parent.type === "workspace" &&
        Date.parse(result.last_edited_time) >= limitTime,
    )
    .map((result) => {
      return getPageBasic(result, type);
    });

  return await getPageDetail(notion, pageContent);
}

export async function getRoot(notion, limitTime) {
  return [...(await getRootPage(notion, limitTime, "page")), ...(await getRootPage(notion, limitTime, "database"))];
}

function sumArray(ary) {
  return ary.reduce((acc, cur) => {
    acc = [...acc, ...cur];
    return acc;
  }, []);
}

function sumChildPage(pageContent, limitTime) {
  return pageContent
    .reduce((acc, cur) => {
      acc = [...acc, ...cur.childPage];
      return acc;
    }, [])
    .filter((page) => Date.parse(page.lastEditedTime) >= limitTime);
}
function getMaxPage(pageContent, pageNum, limitTime) {
  const childPage = sumChildPage(pageContent, limitTime);
  return pageNum + childPage.length > 85 ? childPage.splice(0, 85 - pageNum) : childPage;
}

export async function getChildPage(notion, pageContent, pageNum, limitTime) {
  const childPage = getMaxPage(pageContent, pageNum, limitTime);

  return await getPageDetail(notion, childPage);
}
async function getPages(notion, limitTime) {
  //deprecated
  //root page 처리
  const pageContents = {
    ...(await getRootPage(notion, limitTime, "page")),
    ...(await getRootPage(notion, limitTime, "database")),
  };
  const pageID = Object.keys(pageContents);
  // console.log(pageID);
  //자식 페이지들 재귀탐색 (85개까지만 => 대략 1분 걸림)

  let cursor = -1;

  while (++cursor < pageID.length && pageID.length <= 85) {
    // console.log(cursor);
    const cursorId = pageID[cursor];
    for (let i = 0; i < pageContents[cursorId].childPage.length && pageID.length <= 85; i++) {
      const nowPage = pageContents[cursorId].childPage[i];
      if (nowPage.id in pageContents || nowPage.lastEditedTime > limitTime) continue;
      pageID.push(nowPage.id);
      if (nowPage.type === "page") {
        pageContents[nowPage.id] = sumObject(nowPage, await getDataFromPage(notion, nowPage.id));
      } else {
        pageContents[nowPage.id] = sumObject(nowPage, await getDataFromDatabase(notion, nowPage.id));
      }
    }
  }
  // console.log(pageID);
  // console.log(pageContents);
  return pageContents;
}

export async function getDataFromPage(notion, pageId) {
  const content = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });

  const res = processPageData(content.results);

  //columnList 처리
  const columnLists = await Promise.all(
    res.columnList.map(async (column) => {
      return await getDataFromColumnList(notion, column);
    }),
  );

  columnLists.forEach((columnList) => {
    Object.keys(columnList).forEach((key) => {
      res[key] = [...res[key], ...columnList[key]];
    });
  });

  //자식 페이지 url 처리
  res.childPage = await Promise.all(
    res.childPage.map(async (page) => {
      const nowPage = await notion.pages.retrieve({ page_id: page.id });
      page.myUrl = nowPage.url;
      return page;
    }),
  );

  //자식 DB처리
  const childDatabases = await Promise.all(
    res.childDatabase.map(async (databaseID) => {
      return await notion.databases.retrieve({ database_id: databaseID });
    }),
  );

  childDatabases.forEach(async (childDatabase) => {
    //is_inline에 따라 다르게 처리
    if (!childDatabase.is_inline) {
      //인라인이 아닐 경우 -> 페이지로 간주
      const innerText = getTextFromTextObject(childDatabase?.title);
      res.childPage.push({
        type: "database",
        id: childDatabase.id,
        title: innerText?.length > 0 ? innerText[0] : "-",
        createdTime: childDatabase.created_time,
        lastEditedTime: childDatabase.last_edited_time,
        myUrl: childDatabase.url,
      });
    } else {
      //인라인일 경우 -> 부모 페이지에 종속, 제목 -> h3, 페이지들 -> paragraph
      res.h3 = [...res.h3, ...getTextFromTextObject(childDatabase?.title)];
      const databaseData = await notion.databases.query({
        database_id: childDatabase.id,
      });
      databaseData.results.forEach((data) => {
        if (getTitleFromProperties(data.properties)) res.paragraph.push(getTitleFromProperties(data.properties));
      });
    }
  });

  return res;
}

function processPageData(data) {
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
        res.paragraph.push(val.child_page.title);
        break;
      case "child_database":
        res.childDatabase.push(val.id);
        break;
      case "heading_1":
        if (getTextFromTextObject(val.heading_1?.rich_text).length > 0)
          res.h1 = [...res.h1, ...getTextFromTextObject(val.heading_1?.rich_text)];
        break;
      case "heading_2":
        if (getTextFromTextObject(val.heading_2?.rich_text).length > 0)
          res.h2 = [...res.h2, ...getTextFromTextObject(val.heading_2?.rich_text)];
        break;
      case "heading_3":
        if (getTextFromTextObject(val.heading_3?.rich_text).length > 0)
          res.h3 = [...res.h3, ...getTextFromTextObject(val.heading_3?.rich_text)];
        break;
      case "paragraph":
        if (getTextFromTextObject(val.paragraph?.rich_text).length > 0) {
          //   if (urlRegEx.test(getTextFromTextObject(val.paragraph?.rich_text))) {
          //     getTextFromTextObject(val.paragraph?.rich_text)
          //       .match(urlRegEx)
          //       .forEach((link) => res.links.push({ href: link, favicon: "" }));
          //   } else {
          res.paragraph = [...res.paragraph, ...getTextFromTextObject(val.paragraph?.rich_text)];
          //   }
        }
        break;
      case "callout":
        if (getTextFromTextObject(val.callout?.rich_text).length > 0) {
          res.paragraph = [...res.paragraph, ...getTextFromTextObject(val.callout?.rich_text)];
        }
        break;
      case "quote":
        if (getTextFromTextObject(val.quote?.rich_text).length > 0) {
          res.paragraph = [...res.paragraph, ...getTextFromTextObject(val.quote?.rich_text)];
        }
        break;
      case "bulleted_list_item":
        if (getTextFromTextObject(val.bulleted_list_item?.rich_text).length > 0) {
          res.paragraph = [...res.paragraph, ...getTextFromTextObject(val.bulleted_list_item?.rich_text)];
        }
        break;
      case "numbered_list_item":
        if (getTextFromTextObject(val.numbered_list_item?.rich_text).length > 0) {
          res.paragraph = [...res.paragraph, ...getTextFromTextObject(val.numbered_list_item?.rich_text)];
        }
        break;
      case "to_do":
        if (getTextFromTextObject(val.to_do?.rich_text).length > 0) {
          res.paragraph = [...res.paragraph, ...getTextFromTextObject(val.to_do?.rich_text)];
        }
        break;
      case "toggle":
        //토글 내부를 못 읽는 듯 함
        if (getTextFromTextObject(val.toggle?.rich_text).length > 0) {
          res.paragraph = [...res.paragraph, ...getTextFromTextObject(val.toggle?.rich_text)];
        }
        break;
      case "code":
        if (val.code?.language) res.paragraph.push(val.code.language);
        break;
      case "column_list":
        res.columnList.push(val.id);
        // console.log("컬럼리스트: ", val.column_list);
        break;
      case "image": //이미지, img.[external||file].url에 링크 존재
        //이미지 내부 타입에 따라서 뒤에 오는 변수가 달라짐
        if (val.image.type === "external" && val.image.external?.url) {
          res.image.push(val.image.external.url);
        } else if (val.image.type === "file" && val.image.file?.url) {
          res.image.push(val.image.file.url);
        }
        // console.log("이미지: ", val.image);
        break;
      case "embed": //외부 링크 임베드 embed.url에 링크 존재
        // console.log("임베드링크: ", val.embed);
        if (val.embed?.url) {
          res.links.push({
            href: val.embed.url,
            favicon: "",
          });
        }
        break;
      case "bookmark": //북마크, bookmark.url에 링크 존재
        // console.log("북마크: ", val.bookmark);
        if (val.bookmark?.url) {
          res.links.push({
            href: val.bookmark.url,
            favicon: "",
          });
        }
        break;
      case "link_preview": //링크, link_preview.url
        // console.log("링크 프리뷰: ", val.link_preview);
        if (val.link_preview?.url) {
          res.links.push({
            href: val.link_preview.url,
            favicon: "",
          });
        }
        break;
      case "table":
      case "table_row":
      default:
        // file, video, pdf, divider, equation, table_of_contents, breadcrumb, synced_block, link_to_page, template 등등..
        // console.log(val.type);
        break;
    }
  });

  return res;
}
export async function getDataFromDatabase(notion, databaseId) {
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

  //database.description 처리 필요]
  res.paragraph = [...getTextFromTextObject(database.description)];
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
      myUrl: data.url,
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

  const columnDatas = await Promise.all(
    columns.results.map(async (column) => {
      const columnData = await notion.blocks.children.list({
        block_id: column.id,
        page_size: 50,
      });
      return processPageData(columnData.results);
    }),
  );

  columnDatas.forEach((columnData) => {
    Object.keys(columnData).forEach((key) => {
      res[key] = [...res[key], ...columnData[key]];
    });
  });

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
  //text요소에서 plain_text 찾아서 반환
  if (!textObject?.length || textObject?.length <= 0) return [];
  const res = textObject.map((val) => (val.plain_text ? val.plain_text : ""));
  //   console.log(res);
  return res;
}

export function getLimitTime(period) {
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
