import React, { useState } from "react";
import classes from "./Navbar.module.css";
import Logo from "../assets/images/TickBuk.svg";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useContextStore from "../store/appContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { email, logout } = useContextStore();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <nav className={classes.nav}>
      <div className={classes.nav_content}>
        <div
          className={classes.nav_img}
          onClick={() => {
            localStorage.removeItem("orderDetails");
            navigate("/");
          }}
        >
          <img src={Logo} className={classes.logo} alt="" />
        </div>

        {email ? (
          <>
            <p
              className={classes.email}
              onClick={() => setShowLogout((prev) => !prev)}
            >
              {email[0]}
            </p>
            {showLogout && email && (
              <p className={classes.showLogout} onClick={() => logout()}>
                Logout User
              </p>
            )}
          </>
        ) : (
          <span className={classes.go_home}>{moment().format("ll")}</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
