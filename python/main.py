from fastapi import FastAPI
from konlpy.tag import Kkma
import nltk
import re
from model import NotionData,preprocessedNotionData,preprocessedPage

kkma = Kkma()
nltk.download("book")

app = FastAPI()

def sentence_filtering_eng(sentence):
    replace_rule = re.compile("[^A-Za-z0-9\s]")
    return replace_rule.sub(' ', sentence).strip()

def sentence_filtering_kor(sentence):
    replace_rule = re.compile("[^가-힣0-9\s]")
    return replace_rule.sub(' ', sentence).strip()

def tokenize_kor(sentence_kor):
    return [word for word in kkma.nouns(sentence_kor) if len(word)>=2 ]

def tokenize_eng(sentence_eng):
    is_noun = lambda pos: pos[:2] == "NN"
    tokenized = nltk.word_tokenize(sentence_eng)
    return [word for (word,pos) in nltk.pos_tag(tokenized) if is_noun(pos)]

def extract_keywords(type,page_id,page,ppData):
    if(type == "h1"):
        for sentence in page.h1:
            sentence_kor = sentence_filtering_kor(sentence)
            sentence_eng = sentence_filtering_eng(sentence)
            all_nouns = tokenize_kor(sentence_kor) + tokenize_eng(sentence_eng)
            for keyword in all_nouns:
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].h1_keywords.append(keyword)
    elif(type == "h2"):
        for sentence in page.h2:
            sentence_kor = sentence_filtering_kor(sentence)
            sentence_eng = sentence_filtering_eng(sentence)
            all_nouns = tokenize_kor(sentence_kor) + tokenize_eng(sentence_eng)
            for keyword in all_nouns:
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].h2_keywords.append(keyword)
    elif(type == "h3"):
        for sentence in page.h3:
            sentence_kor = sentence_filtering_kor(sentence)
            sentence_eng = sentence_filtering_eng(sentence)
            all_nouns = tokenize_kor(sentence_kor) + tokenize_eng(sentence_eng)
            for keyword in all_nouns:
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].h3_keywords.append(keyword)
    elif(type == "paragraph"):
        for sentence in page.paragraph:
            sentence_kor = sentence_filtering_kor(sentence)
            sentence_eng = sentence_filtering_eng(sentence)
            all_nouns = tokenize_kor(sentence_kor) + tokenize_eng(sentence_eng)
            for keyword in all_nouns:
                ppData.totalKeywords[keyword]+=1
                ppData.ppPages[page_id].keywords[keyword]+=1
                ppData.ppPages[page_id].p_keywords.append(keyword)

@app.post("/preprocess")
def root(notionData:NotionData):
    test = sentence_filtering_eng("react1를 사용한 프로젝트2😀")
    test2 = sentence_filtering_kor("react1를 사용한 프로젝트2😀")
    print(test,test2)
    ppData = preprocessedNotionData()
    for page_id,page in notionData.pages.items():
        ppData.ppPages[page_id] = preprocessedPage()
        extract_keywords("h1",page_id,page,ppData)
        extract_keywords("h2",page_id,page,ppData)
        extract_keywords("h3",page_id,page,ppData)
        extract_keywords("paragraph",page_id,page,ppData)
    return ppData
