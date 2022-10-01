import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const navStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const logoText = {
    marginLeft: "10px",
  };

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={navStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Voice Room</span>
      </Link>
    </nav>
  );
};

export default Navigation;
