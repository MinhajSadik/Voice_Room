import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../https";
import { setUser } from "../../../redux/features/userSlice";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

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
      navigate("/");
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
      {isLoggedIn && (
        <div className={styles.navRight}>
          <h3>{user?.name}</h3>
          <Link to="/">
            <img
              className={styles.avatar}
              src={user.avatar ? user.avatar : "/images/monkey-avatar.png"}
              width="40"
              height="40"
              alt="avatar"
            />
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            <img src="/images/logout.png" alt="logout" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
