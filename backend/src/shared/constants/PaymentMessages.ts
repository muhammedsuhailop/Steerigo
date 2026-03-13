export const PAYMENT_ERROR_MESSAGES = {
  RIDE_NOT_COMPLETED:
    "Ride {{rideId}} is not completed. Payment can only be initiated for completed rides.",
  PAYMENT_ALREADY_EXISTS: "Payment already exists for ride {{rideId}}.",
  PAYMENT_NOT_FOUND: "Payment {{paymentId}} not found.",
  PAYMENT_NOT_PENDING: "Payment {{paymentId}} is not in PENDING state.",
  INVALID_PAYMENT_SIGNATURE: "Payment signature verification failed.",
  INSUFFICIENT_WALLET_BALANCE:
    "Insufficient wallet balance. Available: {{available}}, Required: {{required}}.",
  WALLET_NOT_FOUND: "Wallet not found for owner {{ownerId}}.",
  UNAUTHORIZED_PAYMENT_ACCESS: "Unauthorized access to payment {{paymentId}}.",
  INVALID_PAYMENT_METHOD: "Invalid or unsupported payment method: {{method}}.",
  CASH_CONFIRMATION_UNAUTHORIZED:
    "Only the assigned driver can confirm cash payment for ride {{rideId}}.",
  INVALID_PAYMENT_AMOUNT: "INVALID_PAYMENT_AMOUNT",
};

export const PAYMENT_MESSAGES = {
  CONFIRMED: "Cash payment confirmed successfully.",
  VERIFIED: "Payment verified successfully.",
  ONLINE_ORDER_CREATED:
    "Payment order created. Complete payment using the gateway.",
  WALLET_PAYMENT_SUCCESS: "Wallet payment processed successfully.",
  CASH_PAYMENT_INITIATED:
    "Cash payment initiated. Driver will collect payment.",
};
