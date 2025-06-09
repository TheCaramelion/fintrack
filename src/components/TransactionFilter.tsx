import { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Alert, TextField, Chip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale/es';
import { format } from 'date-fns';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

const TransactionFilter = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    interface Transaction {
        id: string;
        category: string;
        amount: number;
        createdAt: { seconds: number; nanoseconds: number };
        type: 'income' | 'expense';
    }

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFilter = async () => {
        setError(null);
        setTransactions([]);

        const user = auth.currentUser;

        if (!user) {
            setError('Debes de estar logueado para filtrar transacciones.');
            return;
        }

        if (!startDate || !endDate) {
            setError('Seleccione ambas fechas.');
            return;
        }

        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        try {
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');
            const q = query(
                transactionsRef,
                where('createdAt', '>=', Timestamp.fromDate(startDate)),
                where('createdAt', '<=', Timestamp.fromDate(endOfDay))
            );

            const querySnapshot = await getDocs(q);

            const transactionsData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    category: data.category,
                    amount: data.amount,
                    createdAt: data.createdAt,
                    type: data.type,
                } as Transaction;
            });

            setTransactions(transactionsData);
        } catch (err: unknown) {
            setError('No se pudieron obtener las transacciones. Por favor, inténtalo de nuevo.');
            console.error('Error al obtener las transacciones:', err);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box
                sx={{
                    maxWidth: 600,
                    margin: '0 auto',
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h6">Filtrar transacciones por fecha</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                        label="Fecha de inicio"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        enableAccessibleFieldDOMStructure={false}
                        slots={{ textField: TextField }}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <DatePicker
                        label="Fecha de fin"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        enableAccessibleFieldDOMStructure={false}
                        slots={{ textField: TextField }}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilter}
                    sx={{ marginTop: 2 }}
                >
                    Filtrar transacciones
                </Button>
                {transactions.length > 0 ? (
                    <List sx={{ overflowY: 'auto', maxHeight: 300 }}>
                        {transactions.map((transaction) => (
                            <ListItem key={transaction.id}>
                                <ListItemText
                                    primary={`${transaction.category ? transaction.category : 'No Definido'} - ${transaction.amount}€`}
                                    secondary={format(
                                        new Date(transaction.createdAt.seconds * 1000),
                                        'dd/MM/yyyy'
                                    )}
                                />
                                <Chip
                                    label={transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                                    color={transaction.type === 'income' ? 'success' : 'error'}
                                    sx={{ marginLeft: 2 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No se han encontrado transacciones entre las fechas indicadas.</Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default TransactionFilter;