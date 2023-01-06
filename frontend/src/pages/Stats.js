import React, { useEffect, useState } from "react";
import useContextStore from "../store/appContext";
import { ChartsContainer, Navbar, StatsContainer } from "../components";
import classes from "./Stats.module.css";
import Alert from "../components/Alert";

const Stats = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [adminIsValid, setAdminIsValid] = useState(false);

  const {
    stats,
    showStats,
    showAlert,
    invalidInput,
    totalAmountPaid,
    totalAmountPending,
  } = useContextStore();

  useEffect(() => {
    showStats();
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.email) {
      invalidInput("Kindly input a valid email");
      return;
    }

    try {
      showStats(formData.email);
      setAdminIsValid(true);
    } catch (error) {
      setAdminIsValid(false);
    }
  };

  if (!adminIsValid) {
    return (
      <>
        <Navbar />
        <form className={classes.form} onSubmit={handleSubmit}>
          <h3>Fetch Stats</h3>
          {showAlert && <Alert />}
          <p>Kindly enter an admin email address so we can help fetch stats</p>
          <div className={classes.form_row}>
            <input
              name="email"
              type="email"
              className={classes.form_input}
              onChange={handleChange}
              value={formData.email}
              placeholder="email"
            />
          </div>
          <button className={`btn`} type="submit">
            Submit
          </button>
        </form>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Navbar />
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={classes.container}>
        <div className={classes.summary}>
          <h4>Overall Summary</h4>
          <div className={classes.summary_details}>
            <p>Total Tickets Sold - {stats.paid}</p>
            <p>Total Money In - $ {totalAmountPaid}</p>
            <p>Total Money Pending - $ {totalAmountPending}</p>
          </div>
        </div>
        <StatsContainer />
        <div className={classes.charts}>
          <h3>Sales Performance</h3>
          <ChartsContainer />
        </div>
      </div>
    </>
  );
};

export default Stats;
