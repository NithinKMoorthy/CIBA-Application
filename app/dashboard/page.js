'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faFilter, faArrowUp, faArrowDown, faCreditCard } from "@fortawesome/free-solid-svg-icons";

const BankHomePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 days');
  
  const periods = ['12 months', '30 days', '7 days', '24 hours'];
  
  const moneyFlowData = [
    { month: 'Jan', income: 600, expense: 400 },
    { month: 'Feb', income: 900, expense: 500 },
    { month: 'Mar', income: 750, expense: 450 },
    { month: 'Apr', income: 780, expense: 520 },
    { month: 'May', income: 1100, expense: 600 },
    { month: 'Jun', income: 950, expense: 550 },
    { month: 'Jul', income: 1200, expense: 700 },
    { month: 'Aug', income: 1000, expense: 600 },
    { month: 'Sep', income: 850, expense: 500 },
    { month: 'Oct', income: 1150, expense: 650 },
    { month: 'Nov', income: 1000, expense: 580 },
    { month: 'Dec', income: 850, expense: 520 }
  ];

  const transactions = [
    { type: 'Internal Payment', amount: '+$192.00', date: 'Expiry 06/2024', icon: 'visa', color: 'text-green-500' },
    { type: 'External Payment', amount: '-$216.00', date: 'Expiry 06/2024', icon: 'mastercard', color: 'text-red-500' },
    { type: 'External Payment', amount: '-$221.00', date: 'billing@untitledui.com', icon: 'stripe', color: 'text-red-500' },
    { type: 'Internal Payment', amount: '+$231.00', date: 'Expiry 06/2024', icon: 'visa', color: 'text-green-500' },
    { type: 'External Payment', amount: '-$244.00', date: 'Expiry 06/2024', icon: 'visa', color: 'text-red-500' }
  ];

  const maxValue = Math.max(...moneyFlowData.map(d => d.income + d.expense));

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Banking Dashboard</h1>
          <p className="text-gray-600">Welcome back, Nithin</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
              <span className="text-gray-700">Select dates</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
              <span className="text-gray-700">Filters</span>
            </button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Primary Account Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary account</h3>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 text-sm opacity-90">06/24</div>
              <div className="mb-4">
                <div className="text-sm opacity-90 mb-1">Current Balance</div>
                <div className="text-2xl font-bold">$10,206.20</div>
              </div>
              <div className="text-sm opacity-90 mb-4">hello@nithin.com</div>
              <div className="text-lg tracking-wider">1234 1234 1234 1234</div>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full opacity-90"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full opacity-90"></div>
              </div>
            </div>
          </div>

          {/* Total Income */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Income</h3>
            <p className="text-sm text-gray-500 mb-4">August 2023</p>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-gray-900">$6,421.10</div>
              <div className="flex items-center text-green-500 text-sm">
                <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                2.0%
              </div>
            </div>
            <div className="h-20 relative">
              <svg className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  points="0,15 20,12 40,18 60,14 80,10 100,8 120,6 140,4 160,2 180,0"
                />
                {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((x, i) => (
                  <circle key={i} cx={x} cy={15 - i * 1.5} r="3" fill="#3B82F6" />
                ))}
              </svg>
            </div>
          </div>

          {/* Total Expends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Expends</h3>
            <p className="text-sm text-gray-500 mb-4">August 2023</p>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-gray-900">$561.34</div>
              <div className="flex items-center text-red-500 text-sm">
                <FontAwesomeIcon icon={faArrowDown} className="mr-1" />
                1.0%
              </div>
            </div>
            <div className="h-20 relative">
              <svg className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  points="0,8 20,12 40,10 60,14 80,16 100,18 120,15 140,17 160,19 180,16"
                />
                {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((x, i) => (
                  <circle key={i} cx={x} cy={8 + Math.sin(i) * 5} r="3" fill="#EF4444" />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Money Flow Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Money Flow</h3>
            <div className="h-80">
              <div className="flex items-end justify-between h-full space-x-2">
                {moneyFlowData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                    <div className="w-full max-w-8 flex flex-col space-y-1">
                      <div
                        className="bg-blue-500 rounded-t"
                        style={{ height: `${(data.income / maxValue) * 200}px` }}
                      ></div>
                      <div
                        className="bg-blue-300 rounded-b"
                        style={{ height: `${(data.expense / maxValue) * 200}px` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded"></div>
                  <span className="text-sm text-gray-600">Expense</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transaction</h3>
            <div className="space-y-4">
              {transactions.map((txn, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faCreditCard} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{txn.type}</div>
                      <div className="text-sm text-gray-500">{txn.date}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${txn.color}`}>
                    {txn.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankHomePage;