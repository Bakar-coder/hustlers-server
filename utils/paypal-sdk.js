const paypal = require("@paypal/payouts-sdk");
const client = () => new paypal.core.PayPalHttpClient(environment());
const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (process.env.NODE_ENV === "production")
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

exports.client = client;
