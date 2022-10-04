import UserDto from "../dtos/user.dto.js";
import hashService from "../services/hash.service.js";
import otpService from "../services/otp.service.js";
import tokenService from "../services/token.service.js";
import userService from "../services/user.service.js";

class AuthController {
  async sendOtp(req, res, next) {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ message: "phone field is required" });
    }

    try {
      //generate otp
      const otp = await otpService.generateOtp();

      //hash otp
      const ttl = 1000 * 60 * 2; //2min
      const expires = Date.now() + ttl;
      const data = `${phone}.${otp}.${expires}`;
      const hashed = await hashService.hashOtp(data);

      //send otp
      // await otpService.sendBySms(phone, otp);

      return res.json({
        hash: `${hashed}.${expires}`,
        phone,
        otp, //later otp have to remove
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async verifyOtp(req, res, next) {
    const { otp, hash, phone } = req.body;

    if (!otp || !hash || !phone) {
      return res.status(400).json({ message: "All field are required!" });
    }

    // array distructured and splited from existed hashed otp
    const [hashedOtp, expires] = hash.split(".");

    if (Date.now() > +expires) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    const data = `${phone}.${otp}.${expires}`;

    const isValid = otpService.verifyOtp(hashedOtp, data);

    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP" });
    }

    let user;

    try {
      user = await userService.findUser({ phone });

      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        message: error.message,
      });
    }

    //Token
    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    //store token

    tokenService.storeRefreshToken(refreshToken, user._id);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }
}

export default new AuthController();
