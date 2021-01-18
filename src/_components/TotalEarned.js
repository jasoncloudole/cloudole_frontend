import Link from '@material-ui/core/Link';
import React from 'react';
import Title from './Title';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits({data}) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <React.Fragment>
      <Title>Total Earned</Title>
      <Typography component="p" variant="h4">
        ${data.reduce((rv, x) => rv + x.amount, 0).toFixed(2)}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {data.length ? data[data.length - 1].time: ''}
      </Typography>
      <div>
        <Link color="primary" href="/sell" onClick={() => history.push('/sell')}>
          View details
        </Link>
      </div>
    </React.Fragment>
  );
}