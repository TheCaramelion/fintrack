import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Alert } from '@mui/material';

const TransactionPieChart = () => {
    const [incomeData, setIncomeData] = useState<{ label: string; value: number }[]>([]);
    const [expenseData, setExpenseData] = useState<{ label: string; value: number }[]>([]);
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

                const incomeMap: Record<string, number> = {};
                const expenseMap: Record<string, number> = {};

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.type === 'income') {
                        incomeMap[data.category] = (incomeMap[data.category] || 0) + data.amount;
                    } else if (data.type === 'expense') {
                        expenseMap[data.category] = (expenseMap[data.category] || 0) + data.amount;
                    }
                });

                setIncomeData(
                    Object.entries(incomeMap).map(([label, value]) => ({ label, value }))
                );
                setExpenseData(
                    Object.entries(expenseMap).map(([label, value]) => ({ label, value }))
                );
            } catch (err: any) {
                setError('Failed to fetch transactions. Please try again.');
                console.error('Error fetching transactions:', err);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Income and Expense Breakdown
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 4 }}>
                <Box>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center', marginBottom: 1 }}>
                        Income
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
                        Expenses
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