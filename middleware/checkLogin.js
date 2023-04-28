const jwt = require("jsonwebtoken");
const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const { email } = decoded;
    req.email = email;
    next();
  } catch(err) {
    
    next("Authentication failed");
  }
};
module.exports = checkLogin;
