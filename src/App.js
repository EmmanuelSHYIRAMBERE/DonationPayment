import "./App.css";
import "dotenv/config";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPayment from "./PayPalPayment";

function App() {
  const initialOptions = {
    clientId: process.env.clientId,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="App">
        <h2>PayPal Payment</h2>
        <PayPalPayment />
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
