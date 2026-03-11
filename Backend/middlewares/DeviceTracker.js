const requestIp = require("request-ip");

exports.captureDevice = (req, res, next) => {
  req.clientIp = requestIp.getClientIp(req);
  req.device = req.headers["user-agent"];
  next();
};