const jwt = require("jsonwebtoken");
const RefreshModel = require("../models/refresh-model");
const accessTokenSecret = process.env.JWT_ACCESS_SECRET_TOKEN;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "1y",
    });
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token, userId) {
    try {
      await RefreshModel.create({
        token,
        userId,
      });
    } catch (err) {
      console.error(err.message);
    }
  }
  async verifyAccessToken(token) {
    return jwt.verify(token, accessTokenSecret);
  }

  async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenSecret);
  }

  async findRefreshToken(userId, refreshToken) {
    return await RefreshModel.findOne({
      userId: userId,
      token: refreshToken,
    });
  }

  async updateRefreshToken(userId, refreshToken) {
    return await RefreshModel.updateOne(
      {
        userId: userId,
      },
      {
        token: refreshToken,
      }
    );
  }

  async removeToken(refreshToken) {
    return await RefreshModel.deleteOne({ token: refreshToken });
  }
}

module.exports = new TokenService();
