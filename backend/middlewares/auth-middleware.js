const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error();
    }
    const userData = await tokenService.verifyAccessToken(accessToken);

    if (!userData) {
      throw new Error();
    }
    req.user = userData;
    console.log("userData", userData);
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
