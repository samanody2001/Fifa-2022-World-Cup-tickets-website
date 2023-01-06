import useContextStore from "../store/appContext";

const Alert = () => {
  const { alertType, alertText } = useContextStore();

  return <div className={`alert alert-${alertType}`}>{alertText}</div>;
};

export default Alert;
