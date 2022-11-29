const sse = {};

export function getConnectionSSE(id, res) {
  //해당 id에 이미 연결이 있으면 해제
  if (id in sse) {
    console.log("duplicate" + "\n\n");
    delete sse[id];
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    charset: "UTF-8",
    "Transfer-Encoding": "chunked",
  });
  //redis에 sse등록
  sse[id] = res;
  res.write("connected\n\n");
}

export function writeMessageSSE(id, msg) {
  //id에 매칭되는 연결이 없으면 에러
  if (!(id in sse)) return;
  sse[id].write(msg + "\n\n");
}

export function endConnectionSSE(id) {
  sse[id].write("end \n\n");
  sse[id].end();
  //   if (id in sse) delete sse[id];
}
