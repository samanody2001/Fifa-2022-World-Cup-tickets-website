import React, { useState, useEffect } from "react";
import classes from "./Tickets.module.css";
import {
  Navbar,
  AllTickets,
  SingleTicketModal,
  RegisterEmailModal,
} from "../components";
import { useNavigate } from "react-router-dom";
import useContextStore from "../store/appContext";

const Tickets = () => {
  const [displaySingleTicket, setDisplaySingleTicket] = useState(false);
  const [displayMailModal, setDisplayMailModal] = useState(false);
  const [startedPurchase, setStartedPurchase] = useState(false);

  const navigate = useNavigate();
  const { tickets, getAllTickets, email, resetOrderDetails, orderDetails } =
    useContextStore();

  useEffect(() => {
    getAllTickets();

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (startedPurchase && orderDetails.userId) {
      navigate("/checkout");
    }

    //eslint-disable-next-line
  }, [startedPurchase, orderDetails]);

  const viewSingleTicket = () => {
    setDisplaySingleTicket(true);
  };

  const purchaseTicket = () => {
    setStartedPurchase(true);
    if (!email) {
      setDisplayMailModal(true);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div>
      <Navbar />
      <div className={classes.container}>
        <div className={classes.title_container}>
          <h2 className={classes.title}>All Tickets</h2>
          <input type="date" className={classes.date_input} />
        </div>
        {tickets ? (
          <AllTickets viewSingleTicket={viewSingleTicket} />
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {displaySingleTicket && (
        <SingleTicketModal
          classes={classes}
          goBack={() => {
            resetOrderDetails();
            setDisplaySingleTicket(null);
          }}
          purchaseTicket={() => purchaseTicket()}
        />
      )}

      {displayMailModal && (
        <RegisterEmailModal
          classes={classes}
          toggleDisplayMail={() => setDisplayMailModal(false)}
        />
      )}
    </div>
  );
};

export default Tickets;
