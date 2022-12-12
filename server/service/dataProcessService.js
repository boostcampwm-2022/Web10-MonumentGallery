import axios from "axios";
//Fastapi 서버에 요청을 날려 키워드 분석 및 그룹화, DB에 저장될 데이터로 가공

export async function processDataFromRawContent(rawContent, theme) {
  const keywordData = await getKeywordFromFastAPI(rawContent);
  const grouppedPage = getGroups(keywordData);
  // console.log(rawContent);
  // console.log("keywords : ", keywordData);
  // console.log("groupPage : ", grouppedPage);
  const positionData = getPositions(grouppedPage);
  // console.log(positionData.pages);
  // console.log(positionData.nodes);
  return attachAllDataForDB(rawContent, keywordData, theme, positionData);
}

export function processDataForClient(galleryContent, user) {
  return {
    id: galleryContent._id,
    userName: user.userName,
    theme: galleryContent.theme,
    totalKeywords: getKeywordsAsDictionary(galleryContent.totalKeywords),
    groupKeywords: galleryContent.groupKeywords,
    pages: galleryContent.pages.map((page) => {
      return {
        position: page.position,
        keywords: getKeywordsAsDictionary(page.keywords),
        title: page.title,
        subtitle: page.subtitle,
        links: page.links,
        imagePixel: page.imagePixel,
      };
    }),
    nodes: galleryContent.nodes,
    views: galleryContent.views,
  };
}

function attachAllDataForDB(rawContent, notionKeyword, theme, positionData) {
  return {
    theme: theme,
    totalKeywords: getTop30Keywords(notionKeyword.totalKeywords),
    groupKeywords: positionData.groupKeywords,
    pages: positionData.pages.map((page) => {
      return {
        position: page.position,
        keywords: getTop30Keywords(notionKeyword.ppPages[page.id].keywords),
        title: rawContent[page.id].title ? rawContent[page.id].title : "-",
        subtitle: [
          ...rawContent[page.id].h1.map((keyword) => {
            return {
              hType: "h1",
              text: keyword,
            };
          }),
          ...rawContent[page.id].h2.map((keyword) => {
            return {
              hType: "h2",
              text: keyword,
            };
          }),
          ...rawContent[page.id].h3.map((keyword) => {
            return {
              hType: "h3",
              text: keyword,
            };
          }),
        ],
        links: rawContent[page.id].links,
        imagePixel: rawContent[page.id].imagePixel,
      };
    }),
    nodes: positionData.nodes,
  };
}

async function getKeywordFromFastAPI(rawContent) {
  //자연어 처리 결과 반영 및 데이터 베이스 스키마 형태로 데이터 가공
  try {
    const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
    const fastapiData = getFastAPIFormData(rawContent);
    // console.log(fastapiData);
    // console.log(fastapiData.pages);
    const fastapiResponse = await axios.post(fastapiEndpoint + "/preprocess/text", fastapiData);
    return fastapiResponse.data;
  } catch (err) {
    //에러 처리 부분은 고민해봐야할듯
    console.log("자연어처리 실패함 암튼 실패함");
    console.log(err.message);
    return {};
  }
}

function sortKeywords(keywords) {
  if (keywords === null || keywords === undefined) return [];

  //상위 30개만 산출
  const totalKeywords = Object.keys(keywords).map((key) => [key, keywords[key]]);
  return totalKeywords
    .sort((a, b) => {
      if (a[1] < b[1]) return 1;
      else if (a[1] > b[1]) return -1;
      else return 0;
    })
    .slice(0, 30)
    .map((val) => val[0]);
}

function getTop30Keywords(keywords) {
  return sortKeywords(keywords).map((keyword) => {
    return {
      keyword: keyword,
      freq: keywords[keyword],
    };
  });
}

function getKeywordsAsDictionary(keywords) {
  return keywords.reduce((acc, cur) => {
    acc[cur.keyword] = cur.freq;
    return acc;
  }, {});
}

function getFastAPIFormData(rawContent) {
  //data를 fastapi 서버로 보내기 용이한 형태로 가공
  return Object.keys(rawContent).reduce(
    (acc, cur) => {
      // console.log(cur);
      acc.pages[cur] = {
        title: rawContent[cur].title,
        h1: rawContent[cur].h1,
        h2: rawContent[cur].h2,
        h3: rawContent[cur].h3,
        paragraph: rawContent[cur].paragraph,
      };
      return acc;
    },
    { pages: {} },
  );
}

function getGroups(keywords) {
  const sortedTotalKeywords = sortKeywords(keywords.totalKeywords);
  // console.log(sortedTotalKeywords);

  if (sortedTotalKeywords.length < 3) return {};

  const res = {
    remains: [],
  };

  const totalKeywordSize = sortedTotalKeywords.length > 3 ? 3 : sortedTotalKeywords.length;
  for (let i = 0; i < totalKeywordSize; i++) {
    res[sortedTotalKeywords[i]] = [];
  }

  Object.keys(keywords.ppPages).forEach((key) => {
    const sortedPageKeywords = sortKeywords(keywords.ppPages[key].keywords);
    let isChoice = false;
    for (let i = 0; i < sortedPageKeywords.length; i++) {
      for (let j = 0; j < totalKeywordSize; j++) {
        if (sortedTotalKeywords[j] === sortedPageKeywords[i]) {
          res[sortedTotalKeywords[j]].push(key);
          isChoice = true;
          break;
        }
      }
      if (isChoice) break;
    }
    if (!isChoice) res.remains.push(key);
  });

  return res;
}

function getPositions(groups) {
  //중심 좌표 (0,0)
  let pages = [];
  let nodes = [];
  let groupKeywords = [];

  Object.keys(groups).forEach((keyword, idx) => {
    const nowPositionData = getSquarePositions(groups[keyword], idx, pages.length);
    // console.log(nowPositionData.pages, nowPositionData.nodes);
    let start = pages.length;
    pages = [...pages, ...nowPositionData.pages];
    nodes = [...nodes, ...nowPositionData.nodes];
    groupKeywords = [
      ...groupKeywords,
      ...[{ keyword: keyword, position: pages.length > start ? pages[start].position : [0, 0] }],
    ];
  });
  return {
    pages,
    nodes,
    groupKeywords: groupKeywords,
  };
}

function getSquarePositions(group, direction, startNode) {
  //배열을 받아들여서 이를 마름모 형태로 배치
  //direction에 따라 어떤 좌표를 증가시킬 지 결정됨 0 - 위, 1 - 오른, 2- 아래, 3 - 왼
  //startNode를 기준으로 페이지에 노드 부여
  const distance = 20;
  const dir = [
    [distance, 0],
    [0, distance],
    [-1 * distance, 0],
    [0, -1 * distance],
  ]; // y, x
  const pages = [];
  const nodes = [];
  if (group.length > 0) nodes.push([-1, startNode]);
  let height = 1;
  let y = 0;
  let x = 0;
  let nowNode = 0;
  //node 연결을 위한 정보
  let prevStart = -1;
  let prevEnd = -2;
  while (nowNode < group.length) {
    let nowStart = nowNode;
    y += dir[direction][0];
    x += dir[direction][1];

    pages.push({
      position: [y, x],
      id: group[nowNode++], //페이지 id 들어갈 예정
    });

    for (let i = 1; i <= height / 2 && nowNode < group.length; i++) {
      pages.push({
        position: [
          y + dir[direction - 1 >= 0 ? direction - 1 : dir.length - 1][0] * i,
          x + dir[direction - 1 >= 0 ? direction - 1 : dir.length - 1][1] * i,
        ],
        id: group[nowNode++],
      });

      if (nowNode >= group.length) break;

      pages.push({
        position: [y + dir[(direction + 1) % dir.length][0] * i, x + dir[(direction + 1) % dir.length][1] * i],
        id: group[nowNode++],
      });
    }

    for (let i = 1; i < nowNode - nowStart; i++) {
      nodes.push([startNode + nowStart + i - 1, startNode + nowStart + i]);
    }
    for (let i = 0; i < prevEnd - prevStart && nowStart + i < nowNode; i++) {
      nodes.push([startNode + prevStart + i, startNode + nowStart + i]);
    }
    prevStart = nowStart;
    prevEnd = nowNode;
    if (group.length - nowNode > nowNode) height += 2;
    else height -= 2;
  }
  return {
    pages,
    nodes,
  };
}
