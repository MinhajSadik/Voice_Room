const crypto = require("crypto");
const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");

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
    //hash otp
    const hash = hashService.hashOtp(data);
    

    res.json({
      hash: hash,
    });
  }
}

module.exports = new AuthController();
