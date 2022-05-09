import React from "react";
import Card from "../../Components/Shared/Card/Card";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.cardWrapper}>
      <Card title="Welcome to CodersHouse Voice Room!" icon="handlogo" />
    </div>
  );
};

export default Home;
