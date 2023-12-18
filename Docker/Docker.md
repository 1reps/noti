# Docker

# Why?

1. 다른 OS 환경에서의 버전 문제 등...
2. 가상머신(VM)안에 Linux를 설치해서 모두 같은 OS(Linux) 환경을 만들어준다.
    1. Linux가 가장 가볍고(용량, 속도 등) 개발하기에 가장 안정적이다.
3. Linux 버전은 가급적 통일해야 한다.

# 단점?

1. 컴퓨터 안에 컴퓨터가 또 있으니까 속도가 매우 느리다.
    1. 기본기능(공통)들은 추가로 설치하지 않고 공유(커널)해서 사용

# 설치

1. Mac-OS는 CLI가 Linux언어로 되어있다.
    1. Windows는 WSL(Window Sub-System For Linux)을 추가로 설치해줘야한다.

# Docker란?

1. 부팅 등 운영체제의 핵심 기능(커널)을 공유하는 가상머신(OS 전체를 새로 설치하지 않아도 됨)
2. Docker에 다운을 받아놓으면 파일을 공유할 수 있고, 새로 설치하지 않아도 된다.
3. 개발/배포환경 통일
4. 프로그램 미리 설치
5. 가벼운 가상컴퓨터

# 따라하기

1. 우분투 설치
2. nodejs 설치
3. npm 설치
4. yarn 설치

기존에는 .js 파일 경로에서 node index.js로 실행을 했다면
Docker 파일에 #따라하기 를 실행시켜 순차적으로 설치되도록 해본다.

# Cycling

1. npm
    1. module > npm install or yarn add > vscode > npm login, npm publish > 배포 > module
2. github
    1. SourceCode > git clone or git pull > vscode > git push > SourceCode
3. [hub.docker.com](http://hub.docker.com/)
    1. Computer > docker pull or FROM > vscode > docker push > Computer
    

```docker
# 1. 운영체제 및 프로그램 설치, FROM을 하면 Doker Hub에 있는 파일로부터 다운로드를 할 수 있다.
# FROM ubuntu:22.04

# 2. ubuntu 컴퓨터에 nodejs 설치
# RUN sudo apt install nodejs

# 3. ubuntu 컴퓨터에 nodejs 설치 후 global로 yarn 설치
# RUN sudo npm install -g yarn

# 1. docker hub > node (다른 사용자가 ubuntu, nodejs, npm, yarn을 packaging 해놓음)
FROM node:14

# 2. 내 컴퓨터에 있는 폴더나 파일을 도커 컴퓨터 안으로 복사하기
COPY ./index.js /index.js

# 3. 도커안에서 index.js 실행시키기
CMD node index.js
```