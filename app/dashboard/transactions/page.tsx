import React from 'react';
import Header from '../components/transactions/header';
import Table from '../components/transactions/table';
const Transactions = async () => {
    return (
        <div className="flex flex-col p-4 flex-grow"> 
            <Header /> 
            <Table /> 
        </div>   
    )
}

export default Transactions;