import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../../../Components/Shared/Button/Button";
import Card from "../../../../Components/Shared/Card/Card";
import TextInput from "../../../../Components/Shared/TextInput/TextInput";
import { sendOtp } from "../../../../http/index";
import { setOtp } from "../../../../store/authSlice";
import styles from "../StepPhoneEmail.module.css";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();

  async function submit() {
    if (!phoneNumber) return;
    const { data } = await sendOtp(phoneNumber);

    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onNext();
  }

  return (
    <Card title="Enter you phone number" icon="phone">
      <TextInput
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" onClick={submit} />
        </div>
        <p className={styles.bottomParagraph}>
          By entering your number, you’re agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Phone;
