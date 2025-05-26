import AppLayout from '../components/AppLayout';
import useAuthRedirect from '../hooks/useAuthRedirect';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import TransactionChart from '../components/TransactionChart';
import { Typography, Grid, Paper } from '@mui/material';
import GridSection from '../components/GridSection';

export default function Dashboard() {
  useAuthRedirect();

  return (
    <AppLayout>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#388e3c' }}>
          Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid size={4}>
            <Paper elevation={3} sx={{ p: 2, height: '100%'}}>
              <TransactionList />
            </Paper>
          </Grid>
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