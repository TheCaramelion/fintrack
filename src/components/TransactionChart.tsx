import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Typography, Alert, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale/es';
import { startOfMonth, endOfMonth } from 'date-fns';

const TransactionChart = () => {
    const [expenses, setExpenses] = useState<number>(0);
    const [incomes, setIncomes] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
    const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

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
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);

            const q = query(
                transactionsRef,
                where('createdAt', '>=', Timestamp.fromDate(startDate)),
                where('createdAt', '<=', Timestamp.fromDate(endOfDay))
            );

            unsubscribeTransactions = onSnapshot(
                q,
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
            if (typeof unsubscribeTransactions === 'function') unsubscribeTransactions();
            if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
        };
    }, [startDate, endDate]);

    const data = [
        { label: 'Gastos', value: expenses },
        { label: 'Ingresos', value: incomes },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Gastos vs Ingresos
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker
                        label="Fecha de inicio"
                        value={startDate}
                        onChange={(newValue) => newValue && setStartDate(newValue)}
                        enableAccessibleFieldDOMStructure={false}
                        slots={{ textField: TextField }}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <DatePicker
                        label="Fecha de fin"
                        value={endDate}
                        onChange={(newValue) => newValue && setEndDate(newValue)}
                        enableAccessibleFieldDOMStructure={false}
                        slots={{ textField: TextField }}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
                <BarChart
                    xAxis={[{ data: data.map((item) => item.label) }]}
                    series={[{ data: data.map((item) => item.value) }]}
                    height={220}
                />
            </Box>
        </LocalizationProvider>
    );
};

export default TransactionChart;