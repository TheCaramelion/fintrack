import AppLayout from '../components/AppLayout';
import useAuthRedirect from '../hooks/useAuthRedirect';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import TransactionChart from '../components/TransactionChart';
import { Grid } from '@mui/material';
import StyledPaper from '../styledComponents/StyledPaper';

export default function Dashboard() {
  useAuthRedirect();

  return (
    <AppLayout>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledPaper elevation={3}>
              <TransactionList />
            </StyledPaper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledPaper elevation={3}>
              <TransactionChart/>
            </StyledPaper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledPaper elevation={3}>
              <CategoryList />
            </StyledPaper>
          </Grid>
        </Grid>
    </AppLayout>
  );
}