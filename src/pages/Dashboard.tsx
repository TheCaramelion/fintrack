import AppLayout from '../components/AppLayout';
import useAuthRedirect from '../hooks/useAuthRedirect';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import TransactionChart from '../components/TransactionChart';
import { Paper, Typography, Grid } from '@mui/material';
import GridSection from '../components/GridSection';

export default function Dashboard() {
  useAuthRedirect();

  return (
    <AppLayout>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#388e3c' }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <GridSection>
            <TransactionList />
          </GridSection>
          <GridSection>
            <TransactionChart/>
          </GridSection>
          <GridSection>
            <CategoryList />
          </GridSection>
        </Grid>
    </AppLayout>
  );
}