FROM python:3.9
ENV DEBIAN_FRONTEND noninteractive 
ENV DEBCONF_NONINTERACTIVE_SEEN true
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install openjdk-11-jdk -y
RUN mkdir /usr/app
WORKDIR /usr/app
ADD . /usr/app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
ENTRYPOINT uvicorn main:app --reload --host=0.0.0.0 --port=8000