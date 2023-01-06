import React from "react";
import useContextStore from "../store/appContext";
import classes from "./AllTickets.module.css";
import SingleTicket from "./SingleTicket";

const AllTickets = ({ viewSingleTicket }) => {
  const { tickets } = useContextStore();

  return (
    <div className={classes.tickets}>
      {tickets.map((item) => {
        return (
          <SingleTicket
            viewSingleTicket={viewSingleTicket}
            key={item.matchNumber}
            title={item.homeTeam + " vs " + item.awayTeam}
            date={item.dateUtc}
            location={item.location}
            matchNumber={item.matchNumber}
          />
        );
      })}
    </div>
  );
};

export default AllTickets;
