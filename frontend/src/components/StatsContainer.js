import useContextStore from "../store/appContext";
import classes from "./StatsContainer.module.css";
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa";
import StatsItem from "./StatsItem";

const StatsContainer = () => {
  const { stats } = useContextStore();
  const defaultStats = [
    {
      title: "Paid tickets",
      count: stats.paid || 0,
      icon: <FaSuitcaseRolling />,
      color: "#e9b949",
      bcg: "#fcefc7",
    },
    {
      title: "Pending Tickets",
      count: stats.pending || 0,
      icon: <FaCalendarCheck />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "Cancelled Tickets",
      count: stats.cancelled || 0,
      icon: <FaBug />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
  ];

  return (
    <div className={classes.allStatsContainer}>
      {defaultStats.map((item, index) => {
        return <StatsItem key={index} {...item} />;
      })}
    </div>
  );
};

export default StatsContainer;
