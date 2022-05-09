import React from "react";
import Card from "../../Components/Shared/Card/Card";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.cardWrapper}>
      <Card title="Welcome to CodersHouse Voice Room!" icon="handlogo">
        I’m working hard to get Codershouse ready for everyone! While we wrap up
        the finishing touches, we're adding people gradually to make sure
        nothing breaks
      </Card>
    </div>
  );
};

export default Home;
