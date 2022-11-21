from fastapi import FastAPI
from typing import Dict,List,Optional
from pydantic import BaseModel
from konlpy.tag import Kkma
from konlpy.utils import pprint
from collections import defaultdict

kkma = Kkma()

app = FastAPI()

class Page(BaseModel):
    title: str
    h1: Optional[List[str]]
    h2: Optional[List[str]]
    h3: Optional[List[str]]
    paragraph: Optional[List[str]]
class NotionData(BaseModel):
    pages: Dict[str,Page]
class preprocessedPage(BaseModel):
    keywords: Dict[str,int]
    title: str
    h1: Optional[List[str]]
    h2: Optional[List[str]]
    h3: Optional[List[str]]
    paragraph: Optional[List[str]]
class preprocessedNotionData(BaseModel):
    totalKeywords: Dict[str,int]
    pages: Dict[str,preprocessedPage]


class preprocessedPage:
    def __init__(self):
        self.keywords = defaultdict(int)
        self.title = []
        self.h1_keywords = []
        self.h2_keywords = []
        self.h3_keywords = []
        self.p_keywords = []
class preprocessedNotionData:
     def __init__(self):
        self.totalKeywords = defaultdict(int)
        self.ppPages = {}

@app.post("/preprocess")
def root(notionData:NotionData):
    ppData = preprocessedNotionData()
    for page_id,page in notionData.pages.items():
        ppData.ppPages[page_id] = preprocessedPage()
        for sentense in page.h1:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].h1_keywords.append(keyword)
        for sentense in page.h2:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].h2_keywords.append(keyword)
        for sentense in page.h3:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].h3_keywords.append(keyword)
        for sentense in page.paragraph:
            for keyword in kkma.nouns(sentense):
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].p_keywords.append(keyword)
    return ppData
