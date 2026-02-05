const jwt = require("jsonwebtoken");

const generateToken = (userDataId) => {
  return jwt.sign({ id: userDataId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
