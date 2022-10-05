import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../../../Components/shared/Button/Button";
import Card from "../../../../Components/shared/Card/Card";
import Input from "../../../../Components/shared/Input/Input";
import { sendOtp } from "../../../../https/index";
import { setOtp } from "../../../../redux/features/userSlice";
import styles from "../StepPhoneEmail.module.css";

const Phone = ({ onNext }) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");

  async function submit() {
    if (!phoneNumber) return;
    try {
      const { data } = await sendOtp({ phone: phoneNumber });
      dispatch(setOtp({ phone: data.phone, hash: data.hash }));
      onNext();
    } catch (error) {
      console.log("message", error);
    }
  }

  return (
    <Card title="Enter your phone number" icon="phone">
      <Input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" onClick={submit} />
        </div>
        <p className={styles.bottomParagraph}>
          By entering your number, you're agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Phone;
