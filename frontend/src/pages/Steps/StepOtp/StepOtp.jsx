import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../Components/shared/Button/Button";
import Card from "../../../Components/shared/Card/Card";
import Input from "../../../Components/shared/Input/Input";
import { verifyOtp } from "../../../https";
import { setUser } from "../../../redux/features/userSlice";
import styles from "./StepOtp.module.css";

const StepOtp = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { hash, phone } = useSelector((state) => state.auth.otp);
  const submit = async () => {
    if (!otp || !phone || !hash) return;
    try {
      const { data } = await verifyOtp({ otp, phone, hash });

      dispatch(setUser(data));
      console.log("stepOtp:", data, otp);
    } catch (error) {
      console.log("message", error);
    }
  };

  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock-emoji">
          <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div className={styles.actionButtonWrap}>
            <Button onClick={submit} text="Next" />
          </div>
          <p className={styles.bottomParagraph}>
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
