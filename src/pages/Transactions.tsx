import { Grid } from '@mui/material';
import AppLayout from '../components/AppLayout';
import TransactionChart from '../components/TransactionChart';
import TransactionFilter from '../components/TransactionFilter';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import TransactionPieChart from '../components/TransactionPieChart';
import useAuthRedirect from '../hooks/useAuthRedirect';

export default function Transactions() {
  useAuthRedirect();

  return (
    <>
      <AppLayout>
        <Grid>
          <Grid xs={12} maxWidth={6}>

          </Grid>
        </Grid>
        <TransactionForm/>
        <TransactionList/>
        <TransactionFilter/>
        <TransactionChart/>
        <TransactionPieChart/>
      </AppLayout>
    </>
  );
}