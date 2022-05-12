import React from "react";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";
import StepName from "../Steps/StepName/StepName";

const steps = {
  1: StepName,
  2: StepAvatar,
};

const Activate = () => {
  const [step, setStep] = React.useState(1);

  function onNext() {
    setStep((prevStep) => prevStep + 1);
  }

  const Step = steps[step];
  return (
    <div>
      <Step onNext={onNext} setStep={setStep} />
    </div>
  );
};

export default Activate;
