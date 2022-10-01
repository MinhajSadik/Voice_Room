import React, { useState } from "react";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";
import StepName from "../Steps/StepName/StepName";
import StepOtp from "../Steps/StepOtp/StepOtp";
import StepPhoneEmail from "../Steps/StepPhoneEmail/StepPhoneEmail";
import StepUsername from "../Steps/StepUsername/StepUsername";
import styles from "./Register.module.css";

const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
  3: StepName,
  4: StepAvatar,
  5: StepUsername,
};

const Register = () => {
  const [step, setStep] = useState(1);

  const Step = steps[step];

  const onNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <div className={styles.register}>
      <Step onNext={onNext} />
    </div>
  );
};

export default Register;
