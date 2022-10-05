import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../Components/shared/Button/Button";
import Card from "../../../Components/shared/Card/Card";
import Input from "../../../Components/shared/Input/Input";
import { setName } from "../../../redux/features/activateSlice";
import styles from "../StepName/StepName.module.css";

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const [fullname, setFullname] = useState(name);
  const dispatch = useDispatch();
  function nextStep() {
    if (!fullname) {
      return;
    }

    dispatch(setName(fullname));
    onNext();
  }
  return (
    <>
      <Card title="What’s your full name?" icon="goggle">
        <Input value={fullname} onChange={(e) => setFullname(e.target.value)} />
        <p className={styles.paragraph}>
          People use real names at voice room :) !
        </p>
        <div>
          <Button onClick={nextStep} text="Next" />
        </div>
      </Card>
    </>
  );
};

export default StepName;
