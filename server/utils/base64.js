export function decodeBase64TOJSON(base64URL) {
  if (!base64URL) return {};
  return JSON.parse(Buffer.from(makeBase64URLToBase64(base64URL), "base64").toString("utf8") ?? "{}");
}

export function encodeBase64FromJSON(json) {
  return makeJsonToBase64(json ?? {})
    .replace(/[+]/g, "-")
    .replace(/[/]/g, "_");
}

function makeJsonToBase64(json) {
  return Buffer.from(JSON.stringify(json)).toString("base64").replace(/[=]/g, "");
}

function makeBase64URLToBase64(base64URL) {
  return base64URL.replace(/[-]/g, "+").replace(/[_]/g, "/");
}
