import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Alert, TextField, Chip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

const TransactionFilter: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFilter = async () => {
        setError(null);
        setTransactions([]);

        const user = auth.currentUser;

        if (!user) {
            setError('You must be logged in to filter transactions.');
            return;
        }

        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }

        try {
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');
            const q = query(
                transactionsRef,
                where('createdAt', '>=', Timestamp.fromDate(startDate)),
                where('createdAt', '<=', Timestamp.fromDate(endDate))
            );

            const querySnapshot = await getDocs(q);

            const transactionsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTransactions(transactionsData);
        } catch (err: any) {
            setError('Failed to fetch transactions. Please try again.');
            console.error('Error fetching transactions:', err);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <Typography variant="h6">Filter Transactions by Date</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilter}
                    sx={{ marginTop: 2 }}
                >
                    Filter Transactions
                </Button>
                {transactions.length > 0 ? (
                    <List>
                        {transactions.map((transaction) => (
                            <ListItem key={transaction.id}>
                                <ListItemText
                                    primary={`${transaction.category} - $${transaction.amount}`}
                                    secondary={format(
                                        new Date(transaction.createdAt.seconds * 1000),
                                        'dd/MM/yyyy'
                                    )}
                                />
                                <Chip
                                    label={transaction.type === 'income' ? 'Income' : 'Expense'}
                                    color={transaction.type === 'income' ? 'success' : 'error'}
                                    sx={{ marginLeft: 2 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No transactions found for the selected date range.</Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default TransactionFilter;