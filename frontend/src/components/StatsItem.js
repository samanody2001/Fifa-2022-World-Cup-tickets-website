import classes from "./StatsItem.module.css";

const StatsItem = ({ count, title, icon, color, bcg }) => {
  return (
    <div
      className={classes.statsItemContainer}
      style={{ borderBottom: `5px solid ${color}` }}
    >
      <header>
        <span className={classes.count} style={{ color: color }}>
          {count}
        </span>
        <span className={classes.icon} style={{ background: bcg }}>
          <span style={{ color: color }}>{icon}</span>
        </span>
      </header>
      <h5 className={classes.title}>{title}</h5>
    </div>
  );
};

export default StatsItem;
