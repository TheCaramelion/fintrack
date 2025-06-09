import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Typography, Alert } from '@mui/material';

const TransactionPieChart = () => {
    const [incomeData, setIncomeData] = useState<{ label: string; value: number }[]>([]);
    const [expenseData, setExpenseData] = useState<{ label: string; value: number }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unsubscribeTransactions: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setError('Debes estar logueado para ver el gráfico.');
                setIncomeData([]);
                setExpenseData([]);
                return;
            }

            const transactionsRef = collection(db, 'users', user.uid, 'transactions');
            unsubscribeTransactions = onSnapshot(
                transactionsRef,
                (querySnapshot) => {
                    const incomeMap: Record<string, number> = {};
                    const expenseMap: Record<string, number> = {};

                    for (const doc of querySnapshot.docs) {
                        const data = doc.data();
                        const categoryLabel = data.category ? data.category : 'No Definido';
                        if (data.type === 'income') {
                            incomeMap[categoryLabel] = (incomeMap[categoryLabel] || 0) + data.amount;
                        } else if (data.type === 'expense') {
                            expenseMap[categoryLabel] = (expenseMap[categoryLabel] || 0) + data.amount;
                        }
                    }

                    setIncomeData(
                        Object.entries(incomeMap).map(([label, value]) => ({ label, value }))
                    );
                    setExpenseData(
                        Object.entries(expenseMap).map(([label, value]) => ({ label, value }))
                    );
                },
                (err) => {
                    setError('No se pudieron obtener las transacciones. Por favor, inténtalo de nuevo.');
                    console.error('Error al obtener las transacciones:', err);
                }
            );
        });

        return () => {
            if (unsubscribeTransactions) unsubscribeTransactions();
            unsubscribeAuth();
        };
    }, []);

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Ingresos y Gastos por Categoría
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 4 }}>
                <Box>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center', marginBottom: 1 }}>
                        Ingresos
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: incomeData,
                            },
                        ]}
                        height={300}
                    />
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center', marginBottom: 1 }}>
                        Gastos
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: expenseData,
                            },
                        ]}
                        height={300}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TransactionPieChart;