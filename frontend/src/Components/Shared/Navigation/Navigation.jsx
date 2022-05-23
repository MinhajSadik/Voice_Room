import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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

  async function logoutUser() {
    try {
      const { data } = await logout();

      dispatch(setAuth(data));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Voice Room</span>
      </Link>
      {isAuth && <button onClick={logoutUser}>Logout</button>}
    </nav>
  );
};

export default Navigation;
