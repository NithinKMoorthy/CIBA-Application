'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const transactions = [
  { type: "Apple Service", amount: "+€4,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Google Service", amount: "+€2,999.00", date: "Dec. 09 11:21", status: "Pending", logo: "/google-logo.png" },
  { type: "Apple Service", amount: "-€1,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€8,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€599.00", date: "Dec. 09 11:21", status: "Canceled", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€599.00", date: "Dec. 09 11:21", status: "Canceled", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€4,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Google Service", amount: "+€2,999.00", date: "Dec. 09 11:21", status: "Pending", logo: "/google-logo.png" },
  { type: "Apple Service", amount: "-€1,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€4,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Google Service", amount: "+€2,999.00", date: "Dec. 09 11:21", status: "Pending", logo: "/google-logo.png" },
  { type: "Apple Service", amount: "-€1,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€8,999.00", date: "Dec. 09 11:21", status: "Paid", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€599.00", date: "Dec. 09 11:21", status: "Canceled", logo: "/apple-logo.png" },
  { type: "Apple Service", amount: "+€599.00", date: "Dec. 09 11:21", status: "Canceled", logo: "/apple-logo.png" },
 
];

const statusStyles = {
  Paid: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Canceled: "bg-red-100 text-red-600",
};

const TransactionTable = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This week");

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border mt-10">
      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <div className="flex space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for transactions"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          {/* Period Selector */}
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
            {selectedPeriod}
            <FontAwesomeIcon icon={faEllipsisV} className="ml-2" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="p-3">Type</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {transactions.map((transaction, index) => (
            <tr key={index} className="border-t">
              <td className="p-3 flex items-center">
                <img
                  src={transaction.logo}
                  alt={transaction.type}
                  className="w-6 h-6 mr-2"
                />
                {transaction.type}
              </td>
              <td className={`p-3 ${transaction.amount.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                {transaction.amount}
              </td>
              <td className="p-3">{transaction.date}</td>
              <td className="p-3">
                <span className={`px-3 py-1 text-sm rounded-full ${statusStyles[transaction.status]}`}>
                  {transaction.status}
                </span>
              </td>
              <td className="p-3 text-right">
                <FontAwesomeIcon icon={faEllipsisV} className="text-gray-400" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
