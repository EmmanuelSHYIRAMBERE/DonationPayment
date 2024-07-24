import "./App.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPayment from "./PayPalPayment";

function App() {
  const initialOptions = {
    clientId:
      "AWYHudfmCu1VXnwdjncdZDYE-1rqfq-SBoX37eRVS3lfZ8b_nF-W1hvtTBXuyzkWKaLV8XMawcTPDKWj",
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
