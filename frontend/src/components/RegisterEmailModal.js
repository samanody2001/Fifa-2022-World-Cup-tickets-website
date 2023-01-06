import React, { useState } from "react";
import useContextStore from "../store/appContext";
import Alert from "./Alert";

const RegisterEmailModal = ({ classes, toggleDisplayMail }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const { register: registerUser, showAlert } = useContextStore();

  const register = (event) => {
    event.preventDefault();
    const { name, email } = formData;

    registerUser(name, email);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((item) => ({ ...item, [name]: value }));
  };

  return (
    <div className={classes.register_modal}>
      <div className={classes.register_modal_content}>
        {showAlert && <Alert />}
        <h3>Before You Proceed...</h3>
        <p>
          Kindly input your email address so you can get a confirmation after
          succesful purchase
        </p>
        <form onSubmit={register}>
          <div className={classes.form_row}>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className={classes.form_input + " " + classes.enter_email}
              placeholder="enter your valid email address"
              required
            />
          </div>
          <div className={classes.form_row}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className={classes.form_input + " " + classes.enter_email}
              placeholder="enter your full name"
              required
            />
          </div>
          <button className="btn" type="submit">
            Submit
          </button>
          <button className={`btn ${classes.back}`} onClick={toggleDisplayMail}>
            {"<"} Go back
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterEmailModal;
