import AppLayout from '../components/AppLayout';
import useAuthRedirect from '../hooks/useAuthRedirect';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import TransactionChart from '../components/TransactionChart';

export default function Dashboard() {
  useAuthRedirect();

  return (
    <>
      <AppLayout>
        <TransactionList/>
        <TransactionChart/>
        <CategoryList/>
      </AppLayout>
    </>
  );
}