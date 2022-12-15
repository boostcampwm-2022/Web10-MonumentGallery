export function devRouter(rawRouteList) {
  // 문자열로 된 route list를 정규표현식으로 변환하고, 정규표현식이 아닌 것들을 제거합니다.
  const routeList = rawRouteList
    .map(([route, html]) => {
      if (typeof route === "string") {
        route = new RegExp(`^${route.replace(/\*/g, ".*").replace(/\?/g, ".")}/?$`);
      }
      return [route, html];
    })
    .filter(([route]) => route instanceof RegExp);

  // 요청한 패스가 설정된 라우팅 경로에 맞는지 확인합니다.
  function foundRoute(path) {
    for (let [route, html] of routeList) {
      if (route.test(path)) return html;
    }
    return null;
  }

  return {
    name: "route-server",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const htmlPath = foundRoute(req.originalUrl);
        if (htmlPath === null) return next();
        req.url = htmlPath;
        req.originalUrl = htmlPath;
        next();
      });
    },
  };
}
