import React from "react";
import { useHistory } from "react-router-dom";
import Button from "../../Components/Shared/Button/Button";
import Card from "../../Components/Shared/Card/Card";
import styles from "./Home.module.css";

const Home = () => {
  const history = useHistory();
  function startRegistration() {
    // window.location.href = "/signup";
    history.push("/authenticate");
  }
  return (
    <div className={styles.cardWrapper}>
      <Card title="Welcome to CodersHouse Voice Room!" icon="handlogo">
        <p className={styles.text}>
          I’m working hard to get Codershouse ready for everyone! While we wrap
          up the finishing touches, we're adding people gradually to make sure
          nothing breaks
        </p>
        <div>
          <Button onClick={startRegistration} text="Let's Go" />
        </div>
        <div className={styles.signinWrapper}>
          <span className={styles.hasInvite}>Have an invite text?</span>
        </div>
      </Card>
    </div>
  );
};

export default Home;
