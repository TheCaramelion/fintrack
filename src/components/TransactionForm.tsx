import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const TransactionForm: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense'); // Default to "Expense"
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const user = auth.currentUser;

            if (!user) {
                setError('You must be logged in to create a transaction.');
                return;
            }

            try {
                const categoriesRef = collection(db, 'users', user.uid, 'categories');
                const querySnapshot = await getDocs(categoriesRef);

                const categoriesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setCategories(categoriesData);
            } catch (err: any) {
                setError('Failed to fetch categories. Please try again.');
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const user = auth.currentUser;

        if (!user) {
            setError('You must be logged in to create a transaction.');
            return;
        }

        if (!selectedCategory) {
            setError('Please select a category.');
            return;
        }

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        try {
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');

            await addDoc(transactionsRef, {
                category: selectedCategory,
                amount: Number(amount),
                type: transactionType,
                createdAt: new Date(),
            });

            setSuccess('Transaction created successfully!');
            setSelectedCategory('');
            setAmount('');
            setTransactionType('expense');
        } catch (err: any) {
            setError('Failed to create transaction. Please try again.');
            console.error('Error creating transaction:', err);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: '0 auto',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h6">Create a New Transaction</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    select
                    fullWidth
                    label="Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <FormControl component="fieldset" sx={{ marginTop: 2 }}>
                    <FormLabel component="legend">Transaction Type</FormLabel>
                    <RadioGroup
                        row
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense')}
                    >
                        <FormControlLabel value="income" control={<Radio />} label="Income" />
                        <FormControlLabel value="expense" control={<Radio />} label="Expense" />
                    </RadioGroup>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                >
                    Create Transaction
                </Button>
            </form>
        </Box>
    );
};

export default TransactionForm;