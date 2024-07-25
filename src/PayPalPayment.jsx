import React from "react";
import "dotenv/config";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalPayment = () => {
  const serverUrl = process.env.serverUrl;

  const createOrder = (data, actions) => {
    return fetch(
      `${serverUrl}/api/v1/payments/donate/66a2bf0412ec4b56887f5c6c`,
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
