from fastapi import FastAPI
from typing import Dict,List,Optional
from pydantic import BaseModel
# from konlpy.tag import Kkma
# from konlpy.utils import pprint

app = FastAPI()

class Page(BaseModel):
    title: str
    h1: Optional[List[str]]
    h2: Optional[List[str]]
    h3: Optional[List[str]]
    paragraph: Optional[List[str]]
class NotionData(BaseModel):
    pages: Dict[str,Page]

@app.post("/preprocess")
def root(notionData:NotionData):
    return notionData
