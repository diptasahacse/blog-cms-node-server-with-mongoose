const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkAdmin = async (req, res, next) => {
  const User = mongoose.model("UserInfo");
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const { email } = decoded;
    const requesterInfo = await User.findOne({ email: email });
    console.log(requesterInfo.role)

    if (requesterInfo.role === "admin") {
      next();
    } else {
      next("Role based Authentication failed");
    }
  } catch (err) {
    next("Role based Authentication failed");
  }
};
module.exports = checkAdmin;
