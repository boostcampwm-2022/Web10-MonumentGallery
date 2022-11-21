from collections import defaultdict
from typing import Dict,List,Optional
from pydantic import BaseModel

# 데이터 검증용 클래스
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


# 객체 생성용 클래스
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