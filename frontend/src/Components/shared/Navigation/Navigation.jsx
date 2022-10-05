import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../../https";
import { setUser } from "../../../redux/features/userSlice";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

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

  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setUser(data));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={navStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Voice Room</span>
      </Link>
      {isLoggedIn && <button onClick={logoutUser}>Logout</button>}
    </nav>
  );
};

export default Navigation;
