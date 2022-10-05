import jwt from "jsonwebtoken";
import RefreshModel from "../models/refresh.model.js";

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "1h",
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
    } catch (error) {
      console.error(error.message);
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

  async updateRefreshToken(refreshToken, userId) {
    return await RefreshModel.updateOne(
      { userId: userId },
      { token: refreshToken }
    );
  }
}

export default new TokenService();
