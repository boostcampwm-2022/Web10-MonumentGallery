import axios from "axios";
//Fastapi 서버에 요청을 날려 키워드 분석 및 그룹화

export async function getGroupFromKeyword(rawContent){
    const keywordData = getKeywordFromFastAPI(rawContent);

    const grouppedPage = getGroups()
}

async function getKeywordFromFastAPI(rawContent) {
  //자연어 처리 결과 반영 및 데이터 베이스 스키마 형태로 데이터 가공
  try {
    const fastapiEndpoint = process.env.FASTAPI_ENDPOINT;
    const fastapiData = getFastAPIFormData(rawContent);
    // console.log(fastapiData);
    // console.log(fastapiData.pages);
    const fastapiResponse = await axios.post(fastapiEndpoint + "/preprocess", fastapiData);
    return fastapiResponse.data;
  } catch (err) {
    //에러 처리 부분은 고민해봐야할듯
    console.log(err);
    return {};
  }
}

function sortKeywords(keywords) {
  const totalKeywords = Object.keys(keywords).map((key) => [key, keywords[key]]);
  return totalKeywords.sort((a, b) => {
    if (a[1] < b[1]) return 1;
    else if (a[1] > b[1]) return -1;
    else return 0;
  });
}

function getFastAPIFormData(rawContent) {
  //data를 fastapi 서버로 보내기 용이한 형태로 가공
  return Object.keys(rawContent).reduce(
    (acc, cur) => {
      console.log(cur);
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
  console.log(sortedTotalKeywords);

  const firstKeyword = sortedTotalKeywords[0][0];
  const secondKeyword = sortedTotalKeywords[1][0];
  const thirdKeyword = sortedTotalKeywords[2][0];
  const res = {
    remains: [],
  };
  res[firstKeyword] = [];
  res[secondKeyword] = [];
  res[thirdKeyword] = [];

  Object.keys(keywords.ppPages).forEach((key) => {
    const sortedPageKeywords = sortKeywords(keywords.ppPages[key].keywords);
    let isChoice = false;
    for (let i = 0; i < sortedPageKeywords.length; i++) {
      if (sortedPageKeywords[i][0] === firstKeyword) {
        res[firstKeyword].push(key);
        isChoice = true;
        break;
      } else if (sortedPageKeywords[i][0] === secondKeyword) {
        res[secondKeyword].push(key);
        isChoice = true;
        break;
      } else if (sortedPageKeywords[i][0] === thirdKeyword) {
        res[thirdKeyword].push(key);
        isChoice = true;
        break;
      }
    }
    if (!isChoice) res.remains.push(key);
  });

  return res;
}


