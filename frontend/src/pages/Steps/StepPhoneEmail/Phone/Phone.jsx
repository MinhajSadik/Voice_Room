import React, { useState } from "react";
import Button from "../../../../Components/shared/Button/Button";
import Card from "../../../../Components/shared/Card/Card";
import Input from "../../../../Components/shared/Input/Input";
import styles from "../StepPhoneEmail.module.css";

const Phone = ({ onNext }) => {
  const [phoneNumber, setNumber] = useState("");
  return (
    <Card title="Enter your phone number" icon="phone">
      <Input value={phoneNumber} onChange={(e) => setNumber(e.target.value)} />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" onClick={onNext} />
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
