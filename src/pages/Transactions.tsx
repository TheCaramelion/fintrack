import AppLayout from '../components/AppLayout';
import TransactionChart from '../components/TransactionChart';
import TransactionFilter from '../components/TransactionFilter';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import useAuthRedirect from '../hooks/useAuthRedirect';

export default function Transactions() {
  useAuthRedirect();

  return (
    <>
      <AppLayout>
        <TransactionForm/>
        <TransactionList/>
        <TransactionFilter/>
        <TransactionChart/>
      </AppLayout>
    </>
  );
}