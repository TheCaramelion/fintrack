import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Alert } from '@mui/material';

const TransactionChart = () => {
    const [expenses, setExpenses] = useState<number>(0);
    const [incomes, setIncomes] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            const user = auth.currentUser;

            if (!user) {
                setError('You must be logged in to view the chart.');
                return;
            }

            try {
                const transactionsRef = collection(db, 'users', user.uid, 'transactions');
                const querySnapshot = await getDocs(transactionsRef);

                let totalExpenses = 0;
                let totalIncomes = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.type === 'expense') {
                        totalExpenses += data.amount;
                    } else if (data.type === 'income') {
                        totalIncomes += data.amount;
                    }
                });

                setExpenses(totalExpenses);
                setIncomes(totalIncomes);
            } catch (err: any) {
                setError('Failed to fetch transactions. Please try again.');
                console.error('Error fetching transactions:', err);
            }
        };

        fetchTransactions();
    }, []);

    const data = [
        { label: 'Expenses', value: expenses },
        { label: 'Incomes', value: incomes },
    ];

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Expenses vs Incomes
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <BarChart
                xAxis={[{ data: data.map((item) => item.label) }]}
                series={[{ data: data.map((item) => item.value) }]}
                height={300}
            />
        </Box>
    );
};

export default TransactionChart;