import React from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "../../Components/Shared/Button/Button";
import Card from "../../Components/Shared/Card/Card";
import styles from "./Home.module.css";

const Home = () => {
  const signinLinkStyles = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "10px",
  };
  const history = useHistory();
  function startRegistration() {
    // window.location.href = "/signup";
    history.push("/register");
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
          <Button onClick={startRegistration} text="Get your username" />
        </div>
        <div className={styles.signinWrapper}>
          <span className={styles.hasInvite}>Have an invite text?</span>
          <Link style={signinLinkStyles} to="/login">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
