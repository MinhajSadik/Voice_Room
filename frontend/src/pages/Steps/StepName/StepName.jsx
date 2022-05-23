import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../Components/Shared/Button/Button";
import Card from "../../../Components/Shared/Card/Card";
import TextInput from "../../../Components/Shared/TextInput/TextInput";
import { setName } from "../../../store/activateSlice";
import styles from "./StepName.module.css";

// export default StepName;

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const [fullName, setFullName] = React.useState(name);
  const dispatch = useDispatch();

  function nextStep() {
    if (!fullName) {
      return;
    }
    dispatch(setName(fullName));
    onNext();
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="What's your full name?" icon="goggle-emoji">
          <TextInput
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <p className={styles.paragraph}>
            People use real names at codershous: we won't share your name with
            anyone.
          </p>
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={nextStep} />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepName;
