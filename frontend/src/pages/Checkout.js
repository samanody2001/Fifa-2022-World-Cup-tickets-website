import React, { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm, Navbar } from "../components";
import useContextStore from "../store/appContext";
import axios from "axios";
import classes from "./Checkout.module.css";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51L9xvYJpNW4oWp0MXQxdl3qhB8VxY3MuAwFjEG3qVPomZt2ag1eM2OBMcWG4hJD1Y9b58M9kkJYvpss1XuVkGDDz00exYQZgzk"
);

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
  const {
    orderDetails,
    invalidInput,
    showAlert,
    singleTicket,
    setOrderDetails,
    resetOrderDetails,
  } = useContextStore();

  const renderOnce = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (renderOnce.current) return;
    renderOnce.current = true;
    const getClientSecret = async () => {
      try {
        const { data } = await axios.post(
          "https://sp-shop-api.vercel.app/api/v1/reservation",
          {
            ...orderDetails,
          }
        );
        setOrderDetails("totalOrderAmount", data.totalOrderAmount / 100);
        setClientSecret(data.clientSecret);
      } catch (error) {
        const msg =
          error.response.data.msg || "Something went wrong. Try again later";
        invalidInput(msg);
      }
    };

    getClientSecret();
    //eslint-disable-next-line
  }, []);

  const appearance = {
    theme: "night",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <Navbar />
      <div className={classes.content}>
        <div className={classes.container}>
          <span
            className={classes.cancel}
            onClick={() => {
              resetOrderDetails();
              navigate("/tickets");
            }}
          >
            ❌
          </span>
          <h3>Make Payment</h3>
          {singleTicket ? (
            <div className={classes.order}>
              <p className={classes.order_details}>
                Match no: {orderDetails.matchNumber} - Quantity:{" "}
                {orderDetails.tickets.quantity}
              </p>
              <h4 className={classes.order_title}>
                {singleTicket.homeTeam + " vs " + singleTicket.awayTeam}
              </h4>
              <p className={classes.order_amount}>
                Total Amount: ${orderDetails.totalOrderAmount}
              </p>
            </div>
          ) : (
            <p>No item to purchase</p>
          )}
          {showAlert && <Alert />}
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm classes={classes} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
