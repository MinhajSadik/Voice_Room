import Jimp from "jimp";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import UserDto from "../dtos/user.dto.js";
import hashService from "../services/hash.service.js";
import otpService from "../services/otp.service.js";
import tokenService from "../services/token.service.js";
import userService from "../services/user.service.js";

class AuthController {
  //send otp
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
  //verify otp
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
    const { accessToken, refreshToken } = await tokenService.generateTokens({
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
    return res.json({ user: userDto, auth: true });
  }

  //activate
  async activate(req, res) {
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      const jimpRes = await Jimp.read(buffer);
      jimpRes
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`));
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    const userId = req.user._id;

    try {
      const user = await userService.findUser({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imagePath}`;

      user.save();

      return res.json({ user: new UserDto(user), auth: true });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async refresh(req, res) {
    //get refresh token from cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;

    //check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }

    //check if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );

      if (!token) {
        return res.status(401).json({ message: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    //check if valid user
    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "No User" });
    }
    //generate new tokens
    const { refreshToken, accessToken } = await tokenService.generateTokens({
      _id: userData._id,
    });

    //update refresh token
    try {
      await tokenService.updateRefreshToken(refreshToken, userData._id);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    //put in cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    //response
    const userDto = new UserDto(user);
    return res.json({ user: userDto, auth: true });
  }
}

export default new AuthController();
