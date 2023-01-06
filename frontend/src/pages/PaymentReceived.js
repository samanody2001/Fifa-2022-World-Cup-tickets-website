import React from "react";
import Navbar from "../components/Navbar";
import classes from "./PaymentReceived.module.css";
import Confetti from "react-confetti";
import useWindowSize from "../utils/useWindowSize";
import { Link } from "react-router-dom";

const PaymentReceived = () => {
  const { width, height } = useWindowSize();

  return (
    <>
      <Confetti width={width} height={height} />

      <Navbar />
      <div className={classes.container}>
        <h2 className={classes.title}>Payment Received..</h2>
        <p>
          Congrats on securing your chance to see a world cup match. We'll email
          you the event ticket.
        </p>
        <Link to={"/tickets"} className="btn">
          View All Tickets
        </Link>
      </div>
    </>
  );
};

export default PaymentReceived;
