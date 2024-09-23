"use client" 
import React from 'react';
import MoneyFlowChart from './money-chart';
import TransactionComponent from './transactions';
const DeeperAccount = () => {
  return (
    <div className="flex justify-around flex-grow ">
        <MoneyFlowChart />
        <TransactionComponent /> 
    </div>
  );
};

export default DeeperAccount;
