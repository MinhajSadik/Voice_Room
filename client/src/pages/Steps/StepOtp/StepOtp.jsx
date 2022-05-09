import React from "react";

const StepOtp = ({ onNext }) => {
  return (
    <>
      <div>OTP</div>
      <button onClick={onNext}>Next</button>
    </>
  );
};

export default StepOtp;
