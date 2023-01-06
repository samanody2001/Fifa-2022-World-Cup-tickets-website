import React from "react";
import { BiTime } from "react-icons/bi";
import { BsCalendarDateFill } from "react-icons/bs";
import { MdLocationOn, MdEventAvailable } from "react-icons/md";
import useContextStore from "../store/appContext";
import moment from "moment";
import Alert from "./Alert";

const SingleTicketModal = ({ classes, goBack, purchaseTicket }) => {
  const {
    singleTicket,
    setOrderDetails,
    orderDetails,
    showAlert,
    invalidInput,
  } = useContextStore();

  const isTicketAvailable = () => {
    //implement logic to detect if ticket is available and render conditionally
  };

  const proceedToCheckout = (event) => {
    event.preventDefault();
    const qty = orderDetails.tickets.quantity;
    const category = orderDetails.tickets.category;
    if (!qty || qty < 1 || !category) {
      invalidInput("Please make necessary selections");
      return;
    }
    setOrderDetails("matchNumber", singleTicket.matchNumber);
    purchaseTicket();
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setOrderDetails(name, value);
  };

  return (
    <div className={classes.ticket_modal}>
      <div className={classes.ticket_modal_content}>
        {!singleTicket ? (
          <p>Loading...</p>
        ) : (
          <>
            <h3 className={classes.single_ticket_title}>
              {singleTicket.homeTeam} vs {singleTicket.awayTeam}
            </h3>
            <div className={classes.ticket_modal_content_details}>
              <p className={classes.single_ticket_info}>
                <BsCalendarDateFill className={classes.icon} />
                Date: {moment(singleTicket.dateUtc).format("LL")}
              </p>
              <p className={classes.single_ticket_info}>
                <MdLocationOn className={classes.icon} />
                Location: {singleTicket.location}
              </p>
              <p className={classes.single_ticket_info}>
                <BiTime className={classes.icon} />
                Time: {moment(singleTicket.dateUtc).format("LT")}
              </p>
              <p>
                <MdEventAvailable className={classes.icon} />
                Availability: Ticket Available
              </p>
            </div>

            <form onSubmit={proceedToCheckout}>
              <div className={classes.ticket_details}>
                {showAlert && <Alert />}
                <div className={classes.form_row}>
                  <label className={classes.form_label} htmlFor="category">
                    Select Category:{" "}
                  </label>
                  <select
                    className={classes.form_select}
                    name="category"
                    onChange={handleChange}
                    value={orderDetails.tickets.category}
                  >
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                    <option value="category3">Category 3</option>
                  </select>
                </div>
                <div className={classes.form_row}>
                  <label className={classes.form_label}>Ticket Count: </label>
                  <input
                    name="quantity"
                    type="number"
                    className={classes.form_input}
                    onChange={handleChange}
                    value={orderDetails.tickets.quantity}
                  />
                </div>
              </div>

              <button className={`btn`} type="submit">
                Purchase Ticket
              </button>
              <button className={`btn ${classes.back}`} onClick={goBack}>
                {"<"} Go back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleTicketModal;
