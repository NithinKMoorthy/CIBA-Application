import React from 'react';
import Header from '@/components/transactions/Header';
import Table from '@/components/transactions/TransactionTable';
const Transactions = async () => {
    return (
        <div className="flex flex-col p-4 flex-grow"> 
            <Header /> 
            <Table /> 
        </div>   
    )
}

export default Transactions;