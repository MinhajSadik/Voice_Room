import React from "react";

const StepName = ({ onNext }) => {
  return (
    <>
      <div>Step Name</div>
      <button onClick={onNext}>Next</button>
    </>
  );
};

export default StepName;
