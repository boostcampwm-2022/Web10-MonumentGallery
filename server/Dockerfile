FROM ubuntu
ENV DEBIAN_FRONTEND noninteractive 
ENV DEBCONF_NONINTERACTIVE_SEEN true
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install npm
RUN mkdir /usr/app
WORKDIR /usr/app
ADD . /usr/app
RUN npm i
ENTRYPOINT npm run server