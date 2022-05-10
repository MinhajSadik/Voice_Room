const crypto = require("crypto");
const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
//singleton pattern
class AuthController {
  async sendOtp(req, res) {
    //logic
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }
    //generate otp
    const otp = await otpService.generateOtp();

    const ttl = 1000 * 60 * 2; //2 minutes
    const expries = Date.now() + ttl; //2 minutes from now
    const data = `${phone}.${otp}.${expries}`;
    const hash = hashService.hashOtp(data);

    //send otp
    try {
      // await otpService.sendBySms(phone, otp);
      return res.status(200).json({
        hash: `${hash}.${expries}`,
        phone,
        otp,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const [hashedOtp, expries] = hash.split(".");
    if (Date.now() > +expries) {
      res.status(400).json({
        message: "OTP has expired",
      });
    }

    const data = `${phone}.${otp}.${expries}`;
    const isValid = otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      res.status(400).json({ message: "OTP is invalid" });
    }
    let user;
    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "DB error",
      });
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.json({ accessToken, user });
  }
}

module.exports = new AuthController();
