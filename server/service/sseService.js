export function createConnectionSSE(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    charset: "UTF-8",
    "Transfer-Encoding": "chunked",
  });
  res.write("data: " + JSON.stringify({ kind: "시작", progress: 0, data: {} }) + "\n\n");
}

export function writeMessageSSE(msg, res) {
  console.log(msg);
  res.write("data: " + msg + "\n\n");
}

export function endConnectionSSE(res, data) {
  res.write("data: " + JSON.stringify({ kind: "완료", progress: 100, data: data }) + "\n\n");
}
