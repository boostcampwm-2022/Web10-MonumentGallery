export function getConnectionSSE(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    charset: "UTF-8",
    "Transfer-Encoding": "chunked",
  });
  res.write(JSON.stringify({ kind: "시작", progress: 0, data: {} }) + "\n\n");
}

export function writeMessageSSE(msg, res) {
  res.write(msg + "\n\n");
}

export function endConnectionSSE(res, data) {
  res.write(JSON.stringify({ kind: "완료", progress: 100, data: data }) + "\n\n");
  res.end();
}
