import React from "react";

const StepUsername = ({ onNext }) => {
  return (
    <>
      <div>Username</div>
      <button onClick={onNext}>Next</button>
    </>
  );
};

export default StepUsername;
