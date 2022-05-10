import React, { useState } from "react";
import Button from "../../../../Components/Shared/Button/Button";
import Card from "../../../../Components/Shared/Card/Card";
import TextInput from "../../../../Components/Shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";

const Email = () => {
  const [email, setEmail] = useState("");
  return (
    <Card title="Enter your email id" icon="email">
      <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" />
        </div>
        <p className={styles.buttomParagraph}>
          By entering your email, you're agreeing to our Terms of Service and
          Privacy Policy. Thanks
        </p>{" "}
      </div>
    </Card>
  );
};

export default Email;
