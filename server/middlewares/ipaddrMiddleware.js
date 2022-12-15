export default function ipaddrMiddleware(req, res, next) {
  const ip = req.headers["x-real-ip"];
  if (ip) {
    req.ipaddr = ip;
    next();
    return;
  }
  if (process.env.NODE_ENV === "development") {
    req.ipaddr = "development";
  }
  next();
}
