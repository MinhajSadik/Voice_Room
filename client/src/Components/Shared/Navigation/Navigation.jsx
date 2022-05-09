import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  };
  const logoText = {
    marginLeft: "0.5rem",
  };

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Voice Room</span>
      </Link>
    </nav>
  );
};

export default Navigation;
