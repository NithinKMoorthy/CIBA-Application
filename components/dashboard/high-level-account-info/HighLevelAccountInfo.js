import React from 'react';
import Card from '@/components/dashboard/graphs/card';
import Expenses from '@/components/dashboard/graphs/total-expense';
import Income from '@/components/dashboard/graphs/total-income';

import MoneyChart from '@/components/dashboard/graphs/DeeperAccount/money-chart';

const HighLevelAccountInfo = async () => {
    return (
        <div className="flex p-4 justify-around "> 
            <Card /> 
            <Income /> 
            <Expenses />
        </div>   
    )
}

export default HighLevelAccountInfo;