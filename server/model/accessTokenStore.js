const accessTokenStore = new Map();

export function saveTokenData(token, data) {
  accessTokenStore.set(token, data);
}

export function loadDataFromToken(token) {
  if(!accessTokenStore.has(token)) return null;
  return accessTokenStore.get(token);
}
