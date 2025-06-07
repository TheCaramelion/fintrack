import { Box, Grid } from '@mui/material';
import AppLayout from '../components/AppLayout';
import TransactionChart from '../components/TransactionChart';
import TransactionFilter from '../components/TransactionFilter';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import TransactionPieChart from '../components/TransactionPieChart';
import useAuthRedirect from '../hooks/useAuthRedirect';
import StyledPaper from '../styledComponents/StyledPaper';

export default function Transactions() {
  useAuthRedirect();

  return (
      <AppLayout>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 0 } }}>
            <StyledPaper elevation={3}>
              <TransactionForm/>
            </StyledPaper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 0 } }}>
            <StyledPaper elevation={3}>
              <TransactionList/>
            </StyledPaper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 0 } }}>
            <StyledPaper elevation={3}>
              <TransactionFilter/>
            </StyledPaper>
          </Grid>
        </Grid>

        <Box my={8}/>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 0 } }}>
            <StyledPaper elevation={3}>
              <TransactionChart/>
            </StyledPaper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} sx={{ pt: { xs: 4, md: 0 } }}>
            <StyledPaper elevation={3}>
              <TransactionPieChart/>
            </StyledPaper>
          </Grid>
        </Grid>
      </AppLayout>
  );
}