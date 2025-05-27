import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Box, Typography, Alert } from '@mui/material';

const TransactionChart = () => {
    const [expenses, setExpenses] = useState<number>(0);
    const [incomes, setIncomes] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setError('You must be logged in to view the chart.');
            return;
        }

        const transactionsRef = collection(db, 'users', user.uid, 'transactions');
        const unsubscribe = onSnapshot(
            transactionsRef,
            (querySnapshot) => {
                let totalExpenses = 0;
                let totalIncomes = 0;

                for (const doc of querySnapshot.docs) {
                    const data = doc.data();
                    if (data.type === 'expense') {
                        totalExpenses += Number(data.amount);
                    } else if (data.type === 'income') {
                        totalIncomes += Number(data.amount);
                    }
                }

                setExpenses(totalExpenses);
                setIncomes(totalIncomes);
            },
            (err) => {
                setError('Failed to fetch transactions. Please try again.');
                console.error('Error fetching transactions:', err);
            }
        );

        return () => unsubscribe();
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