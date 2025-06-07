import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Typography, Alert } from '@mui/material';

const TransactionChart = () => {
    const [expenses, setExpenses] = useState<number>(0);
    const [incomes, setIncomes] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unsubscribeTransactions: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setError('Debes estar logueado para ver el gráfico.');
                setExpenses(0);
                setIncomes(0);
                return;
            }

            const transactionsRef = collection(db, 'users', user.uid, 'transactions');
            unsubscribeTransactions = onSnapshot(
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
                    setError('Error al obtener las transacciones. Por favor, inténtalo de nuevo.');
                    console.error('Error al obtener las transacciones:', err);
                }
            );
        });

        return () => {
            if (unsubscribeTransactions) unsubscribeTransactions();
            unsubscribeAuth();
        };
    }, []);

    const data = [
        { label: 'Gastos', value: expenses },
        { label: 'Ingresos', value: incomes },
    ];

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Gastos vs Ingresos
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