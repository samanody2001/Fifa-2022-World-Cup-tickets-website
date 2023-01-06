import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Landing.module.css";
import { Navbar } from "../components";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className={classes.container}>
        <div className={classes.content}>
          <h1>Let's Help You Reserve A Spot At The World Cup</h1>
          <p></p>
          <Link to="/tickets" className={`btn ${classes.view}`}>
            View Tickets
          </Link>
        </div>
        <p className={classes.footer}>
          Are you an admin?{" "}
          <span
            className={classes.viewStats}
            onClick={() => navigate("/stats")}
          >
            View Stats
          </span>
        </p>
      </div>
    </>
  );
};

export default Landing;
