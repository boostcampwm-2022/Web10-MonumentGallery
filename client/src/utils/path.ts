export function parsePaths(base = "") {
  const params = location.pathname.split("/");
  const baseIdx = params.findIndex((i) => i === base);
  return params.slice(baseIdx + 1);
}
