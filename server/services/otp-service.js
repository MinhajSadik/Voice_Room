const crypto = require("crypto");
const hashService = require("../services/hash-service");

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.AUTH_TOKEN;
const smsNumber = process.env.SMS_FROM_NUMBER;
const twilio = require("twilio")(smsSid, smsAuthToken, {
  lazyLoading: true,
});

class OtpService {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }
  async sendBySms(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: smsNumber,
      body: `Your coders house voice_room OTP is ${otp} (valid for 2 minutes)`,
    });
  }
  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);
    return hashedOtp === computedHash;
  }
}

module.exports = new OtpService();
