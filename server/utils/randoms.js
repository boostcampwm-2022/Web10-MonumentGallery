export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export function getRandomDate() {
  //2022년 12월 5일부터 현 시간까지
  // return getRandomInt(1670224522812, Date.now());
  return getRandomInt(0, Date.now());
}
