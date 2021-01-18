import { Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import React from 'react';
import Title from './Title';
import { useTheme } from '@material-ui/core/styles';

export default function Chart({data}) {
  const theme = useTheme();
  let total = 0;
  const accdata = data.map(
    i => {
      total += i.amount;
      return {
        ...i,
        amount: total
      }
    }
  )
  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={accdata}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}