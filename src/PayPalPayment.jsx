import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";

const PayPalPayment = () => {
  const serverUrl = "http://localhost:5000";

  const createOrder = (data, actions) => {
    return fetch(
      `${serverUrl}/api/v1/payments/donate/666eb5d9c097f4f0c1a08440`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((order) => {
        console.log("Order created successfully:", order.id);
        return order.id;
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  const onApprove = (data, actions) => {
    return fetch(`${serverUrl}/api/v1/payments/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    })
      .then((response) => {
        console.log("Payment successfully captured!");
        return response.json();
      })
      .then((orderData) => {
        console.log("Order captured successfully:", orderData);
      })
      .catch((error) => {
        console.error("Error capturing order:", error);
      });
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      style={{
        shape: "pill",
        layout: "vertical",
        label: "donate",
      }}
    />
  );
};

export default PayPalPayment;
