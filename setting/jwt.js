const   jwt         = require('jsonwebtoken')
const dotenv = require('dotenv');
// setup global
dotenv.config();

const verifyUserToken = (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({"responseCode": 401, "responseMsg":"Unauthorized Request"});
    }
    const token = req.headers["authorization"].split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({"responseCode": 401, "responseMsg": "Access denied. No token provided."});
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(400).json({"responseCode": 400, "responseMsg":"Invalid Token."});
    }
  };

  module.exports = verifyUserToken;