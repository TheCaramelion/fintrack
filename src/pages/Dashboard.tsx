import AppLayout from '../components/AppLayout';
import useAuthRedirect from '../hooks/useAuthRedirect';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import TransactionChart from '../components/TransactionChart';
import { Grid } from '@mui/material';
import StyledPaper from '../styledComponents/StyledPaper';
import CategorySummaryCards from '../components/CategorySummary';

export default function Dashboard() {
  useAuthRedirect();

  return (
    <AppLayout>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 0 } }}>
          <StyledPaper elevation={3}>
            <TransactionList />
          </StyledPaper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 0 } }}>
          <StyledPaper elevation={3}>
            <TransactionChart />
          </StyledPaper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 0 } }}>
          <StyledPaper elevation={3}>
            <CategoryList />
          </StyledPaper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ pt: { xs: 4, md: 0 }, mt: { xs: 4, md: 6 } }}>
          <StyledPaper elevation={3}>
            <CategorySummaryCards title="Resumen de gastos mensual" type="expense" />
          </StyledPaper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ pt: { xs: 4, md: 0 }, mt: { xs: 4, md: 6 } }}>
          <StyledPaper elevation={3}>
            <CategorySummaryCards title="Resumen de ingresos mensual" type="income" />
          </StyledPaper>
        </Grid>
      </Grid>
    </AppLayout>
  );
}