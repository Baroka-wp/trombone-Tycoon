
import React from 'react';
// FIX: Import ReferenceLine from recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { ProfitData } from '../types';

interface ProfitChartProps {
  data: ProfitData[];
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 0, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="cycle" stroke="#94a3b8" name="Cycle" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #475569',
              borderRadius: '0.5rem'
            }} 
            labelStyle={{ color: '#f1f5f9' }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          <Line type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={2} dot={false} name="Bénéfice par Cycle" />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;
