import AppLayout from '../components/AppLayout';
import useAuthRedirect from '../hooks/useAuthRedirect';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import TransactionChart from '../components/TransactionChart';
import { Paper, Typography, Grid } from '@mui/material';
import PageContainer from '../components/PageContainer';

export default function Dashboard() {
  useAuthRedirect();

  return (
    <AppLayout>
      <PageContainer>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#388e3c' }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <TransactionList />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} container direction="column" spacing={3}>
            <Grid item>
              <Paper elevation={3} sx={{ p: 2 }}>
                <TransactionChart />
              </Paper>
            </Grid>
            <Grid item>
              <Paper elevation={3} sx={{ p: 2 }}>
                <CategoryList />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </PageContainer>
    </AppLayout>
  );
}