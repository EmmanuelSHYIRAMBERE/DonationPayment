import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import cors from "cors";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    console.log("Access token generated:", data);
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const createOrder = async (data) => {
  try {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: data.donation.amount,
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const jsonResponse = await response.json();
    console.log("PayPal create order response:", jsonResponse);

    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    console.log("Handle response:", jsonResponse);
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    console.log("Failed to parse response body as JSON:", err);
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/v1/payments", async (req, res) => {
  try {
    const { donation } = req.body;
    console.log("Creating order with data:", donation);
    const { jsonResponse, httpStatusCode } = await createOrder({ donation });
    if (httpStatusCode !== 201) {
      throw new Error(`Failed to create order. Status code: ${httpStatusCode}`);
    }
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/v1/payments/capture", async (req, res) => {
  try {
    const { orderID } = req.body;
    console.log("Capturing order with ID:", orderID);
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});
