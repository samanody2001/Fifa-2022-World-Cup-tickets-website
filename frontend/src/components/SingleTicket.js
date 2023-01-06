import React from "react";
import classes from "./SingleTicket.module.css";
import moment from "moment";
import useContextStore from "../store/appContext";

const SingleTicket = ({
  viewSingleTicket,
  title,
  date,
  location,
  matchNumber,
}) => {
  const { getSingleTicket } = useContextStore();

  const displaySingleTicket = () => {
    getSingleTicket(matchNumber)
    viewSingleTicket()
  };
  return (
    <div className={classes.single_ticket}>
      <h4 className={classes.single_ticket_title}>{title}</h4>
      <p className={classes.single_ticket_info}>
        {moment(date).format("LL")} - {location}
      </p>
      <button
        className={`btn ${classes.btn}`}
        onClick={() => displaySingleTicket()}
      >
        See More
      </button>
    </div>
  );
};

export default SingleTicket;
