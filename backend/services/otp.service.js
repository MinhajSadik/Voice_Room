import crypto from "crypto";
import dotenv from "dotenv";
import twilio from "twilio";
import hashService from "./hash.service.js";
dotenv.config();

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;

const client = twilio(smsSid, smsAuthToken);

class OtpService {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
    return await client.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `Your Voice Room OTP is ${otp}`,
    });
  }

  async verifyOtp(hashedOtp, data) {
    let computedHash = await hashService.hashOtp(data);

    return computedHash === hashedOtp;
  }

  sendByMail() {}
}

export default new OtpService();
