"use client" 
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Jan', Profit: 200, Income: 300, Expend: 100 },
  { name: 'Feb', Profit: 300, Income: 400, Expend: 200 },
  { name: 'Mar', Profit: 250, Income: 350, Expend: 150 },
  { name: 'Apr', Profit: 300, Income: 400, Expend: 100 },
  { name: 'May', Profit: 400, Income: 500, Expend: 200 },
  { name: 'Jun', Profit: 350, Income: 450, Expend: 150 },
  { name: 'Jul', Profit: 400, Income: 600, Expend: 200 },
  { name: 'Aug', Profit: 350, Income: 500, Expend: 150 },
  { name: 'Sep', Profit: 300, Income: 450, Expend: 100 },
  { name: 'Oct', Profit: 400, Income: 550, Expend: 200 },
  { name: 'Nov', Profit: 350, Income: 500, Expend: 150 },
  { name: 'Dec', Profit: 300, Income: 450, Expend: 100 },
];

const MoneyFlowChart = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-2 w-full h-full ">
      <h2 className="text-xl font-bold mb-4">Money Flow</h2>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Profit" stackId="a" fill="#d3d3d3" />
          <Bar dataKey="Income" stackId="a" fill="#6ea8fe" />
          <Bar dataKey="Expend" stackId="a" fill="#1d4ed8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoneyFlowChart;
