import React, { useState } from "react";
import Button from "../../../../Components/Shared/Button/Button";
import Card from "../../../../Components/Shared/Card/Card";
import TextInput from "../../../../Components/Shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <Card title="Enter your phone number" icon="phone">
      <TextInput
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" onClick={onNext} />
        </div>
        <p className={styles.bottomParagraph}>
          By entering your phone number, you're agreeing to our Terms of Service
          and Privacy Policy. Thanks
        </p>
      </div>
    </Card>
  );
};

export default Phone;
