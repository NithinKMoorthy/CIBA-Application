import React from "react";

const transactions = [
  {
    type: "Internal Payment",
    amount: "+$192.00",
    paymentMethod: "Visa",
    expiry: "06/2024",
    isPositive: true,
  },
  {
    type: "External Payment",
    amount: "-$216.00",
    paymentMethod: "Mastercard",
    expiry: "06/2024",
    isPositive: false,
  },
  {
    type: "External Payment",
    amount: "-$221.00",
    paymentMethod: "Stripe",
    email: "billing@untitledui.com",
    isPositive: false,
  },
  {
    type: "Internal Payment",
    amount: "+$231.00",
    paymentMethod: "Visa",
    expiry: "06/2024",
    isPositive: true,
  },
  {
    type: "External Payment",
    amount: "-$211.00",
    paymentMethod: "Visa",
    isPositive: false,
  },
];

const TransactionComponent = () => {
  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg p-6 ml-4 w-[33%] h-full ">
      <h2 className="text-xl font-semibold mb-4">Recent Transaction</h2>
      <div>
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <div className="flex items-center space-x-3">
              {/* Payment Method Logo */}
              {transaction.paymentMethod === "Visa" && (
                <img src="/visa.png" alt="Visa" className="w-6 h-6" />
              )}
              {transaction.paymentMethod === "Mastercard" && (
                <img
                  src="/mastercard.png"
                  alt="Mastercard"
                  className="w-6 h-6"
                />
              )}
              {transaction.paymentMethod === "Stripe" && (
                <img src="/stripe.png" alt="Stripe" className="w-6 h-6" />
              )}

              {/* Transaction Details */}
              <div>
                <p className="text-gray-700">{transaction.type}</p>
                <p className="text-xs text-gray-400">
                  {transaction.expiry
                    ? `Expiry ${transaction.expiry}`
                    : transaction.email}
                </p>
              </div>
            </div>
            {/* Amount */}
            <div
              className={`font-semibold ${
                transaction.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionComponent;
