import { Routes, Route, BrowserRouter } from "react-router-dom";
import Checkout from "./pages/Checkout";
import Landing from "./pages/Landing";
import Tickets from "./pages/Tickets";
import PaymentReceived from "./pages/PaymentReceived";
import Stats from "./pages/Stats";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/paymentReceived" element={<PaymentReceived />} />
        <Route path="/*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
