import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../Components/Shared/Button/Button";
import Card from "../../../Components/Shared/Card/Card";
import TextInput from "../../../Components/Shared/TextInput/TextInput";
import { verifyOtp } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import styles from "./StepOtp.module.css";

const StepOtp = () => {
  const [otp, setOtp] = React.useState("");
  const dispatch = useDispatch();
  const { phone, hash } = useSelector((state) => state.auth.otp);
  async function submit() {
    if (!otp || !phone || !hash) {
      return;
    }
    try {
      const { data } = await verifyOtp({ otp, phone, hash });
      console.log(data);
      dispatch(setAuth(data));
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={submit} />
          </div>
          <p className={styles.bottomParagraph}>
            I've send a OTP which will be valid for 2 minutes, after that you'll
            get another one
          </p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
