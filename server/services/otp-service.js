const crypto = require("crypto");

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
      body: `Your coders house OTP is ${otp}`,
    });
  }
  verifyOtp() {}
}

module.exports = new OtpService();
