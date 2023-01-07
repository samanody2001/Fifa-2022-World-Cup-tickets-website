import { useContext, createContext, useState } from "react";
import axios from "axios";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  tickets: [],
  singleTicket: null,
  email: JSON.parse(localStorage.getItem("email")) || "",
  orderDetails: {
    matchNumber: null,
    tickets: {
      category: "category1",
      quantity: 1,
      price: 0,
    },
    userId: JSON.parse(localStorage.getItem("userId")) || null,
    totalOrderAmount: 0,
  },
  stats: null,
  chartData: null,
  totalAmountPaid: 0,
  totalAmountPending: 0,
};

const AppContext = createContext(initialState);

const baseUrl = "/api/v1";

const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  //invalidInput
  const invalidInput = (msg) => {
    setState((prevValue) => ({
      ...prevValue,
      showAlert: true,
      alertType: "danger",
      alertText: msg,
    }));
    clearAlert();
  };

  //clearAlert
  const clearAlert = () => {
    setTimeout(() => {
      setState((prevValue) => ({
        ...prevValue,
        showAlert: false,
        alertType: "",
        alertText: "",
      }));
    }, 2000);
  };

  //get all tickets
  const getAllTickets = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/shop/allProducts`);
      console.log(data);
      setState((prevValue) => ({ ...prevValue, tickets: data.tickets }));
    } catch (error) {
      console.log(error);
      const msg =
        error.response.data.msg || "Something went wrong. Try again later";
      invalidInput(msg);
      clearAlert();
    }
  };

  //get single ticket
  const getSingleTicket = async (matchNumber) => {
    try {
      const { data } = await axios.post(`${baseUrl}/shop/singleProduct`, {
        matchNumber,
      });

      setState((prevValue) => ({ ...prevValue, singleTicket: data.ticket }));
    } catch (error) {
      const msg =
        error.response.data.msg || "Something went wrong. Try again later";
      invalidInput(msg);
      clearAlert();
    }
  };

  //setOrderDetails
  const setOrderDetails = (name, value) => {
    if (
      name === "matchNumber" ||
      name === "userId" ||
      name === "totalOrderAmount"
    ) {
      console.log(name, value);
      setState((prevValue) => ({
        ...prevValue,
        orderDetails: {
          ...state.orderDetails,
          [name]: value,
        },
      }));
    } else {
      setState((prevValue) => ({
        ...prevValue,
        orderDetails: {
          matchNumber: null,
          tickets: {
            ...state.orderDetails.tickets,
            [name]: value,
          },
          userId: JSON.parse(localStorage.getItem("userId")) || null,
        },
      }));
    }
  };

  //reset order details
  const resetOrderDetails = () => {
    setState((prevValue) => ({
      ...prevValue,
      singleTicket: null,
      orderDetails: {
        matchNumber: null,
        tickets: {
          category: "category1",
          quantity: 1,
          price: 0,
        },
        userId: JSON.parse(localStorage.getItem("userId")) || null,
        totalOrderAmount: 0,
      },
    }));
  };

  //register User
  const register = async (name, email) => {
    try {
      const { data } = await axios.post(`${baseUrl}/user/register`, {
        name,
        email,
      });
      const userId = data.user._id;
      setOrderDetails("userId", userId);
      setState((prevValue) => ({ ...prevValue, email }));
      localStorage.setItem("userId", JSON.stringify(userId));
      localStorage.setItem("email", JSON.stringify(email));
    } catch (error) {
      const msg =
        error.response.data.msg || "Something went wrong. Try again later";
      invalidInput(msg);
      clearAlert();
    }
  };

  //show stats
  const showStats = async (email) => {
    try {
      const { data } = await axios.post(`${baseUrl}/order/showStats`, {
        email,
      });
      const stats = data.defaultStats;
      const chartData = data.categoryStats.map((item) => {
        let obj = {};
        for (const data of item.tickets) {
          obj[data.category] = data.count;
        }
        const result = {
          date: item.date,
          ...obj,
        };
        return result;
      });

      let totalAmountPaid = 0;
      const amountPaid = data.totalAmount.filter((item) => item._id === "paid");
      if (amountPaid) {
        totalAmountPaid = amountPaid[0].count;
      }

      let totalAmountPending = 0;
      const amountPending = data.totalAmount.filter(
        (item) => item._id === "pending"
      );
      if (amountPending) {
        totalAmountPending = amountPending[0].count;
      }

      setState((prevValue) => {
        return {
          ...prevValue,
          stats,
          chartData,
          totalAmountPaid,
          totalAmountPending,
        };
      });
    } catch (error) {
      console.log(error);
      const msg =
        error.response.data.msg || "Something went wrong. Try again later";
      invalidInput(msg);
      clearAlert();
    }
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    setState((prevValue) => ({ ...prevValue, email: "" }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        getAllTickets,
        getSingleTicket,
        setOrderDetails,
        register,
        invalidInput,
        logout,
        resetOrderDetails,
        showStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useContextStore = () => {
  return useContext(AppContext);
};

export default useContextStore;
export { AppProvider };
