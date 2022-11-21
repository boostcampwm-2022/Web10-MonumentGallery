from fastapi import FastAPI
from konlpy.tag import Kkma
from model import NotionData,preprocessedNotionData,preprocessedPage

kkma = Kkma()

app = FastAPI()

@app.post("/preprocess")
def root(notionData:NotionData):
    ppData = preprocessedNotionData()
    for page_id,page in notionData.pages.items():
        ppData.ppPages[page_id] = preprocessedPage()
        for sentense in page.h1:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].h1_keywords.append(keyword)
        for sentense in page.h2:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].h2_keywords.append(keyword)
        for sentense in page.h3:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].h3_keywords.append(keyword)
        for sentense in page.paragraph:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].p_keywords.append(keyword)
    return ppData
