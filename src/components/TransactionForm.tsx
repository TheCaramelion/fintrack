import type React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale/es';

const TransactionForm = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(new Date());

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setError('Debes estar logueado para crear una transacción.');
            return;
        }

        const categoriesRef = collection(db, 'users', user.uid, 'categories');
        const unsubscribe = onSnapshot(categoriesRef, (querySnapshot) => {
            const categoriesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesData);
        }, (err) => {
            setError('No se pudieron obtener las categorías. Por favor, inténtalo de nuevo.');
            console.error('Error al obtener las categorías:', err);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const user = auth.currentUser;

        if (!user) {
            setError('Debes estar logueado para crear una transacción.');
            return;
        }

        if (!selectedCategory) {
            setError('Por favor selecciona una categoría.');
            return;
        }

        if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Por favor ingresa una cantidad válida.');
            return;
        }

        if (!date) {
            setError('Por favor selecciona una fecha.');
            return;
        }

        try {
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');

            await addDoc(transactionsRef, {
                category: selectedCategory,
                amount: Number(amount),
                type: transactionType,
                createdAt: date,
            });

            setSuccess('¡Transacción creada exitosamente!');
            setSelectedCategory('');
            setAmount('');
            setTransactionType('expense');
        } catch (err: unknown) {
            setError('No se pudo crear la transacción. Por favor, inténtalo de nuevo.');
            console.error('Error al crear la transacción:', err);
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
            <Typography variant="h6">Crear una nueva transacción</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        select
                        fullWidth
                        label="Categoría"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        sx={{ mb: 2 }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Cantidad"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <DatePicker
                        label="Fecha"
                        value={date}
                        onChange={setDate}
                        slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
                    />
                    <FormControl component="fieldset" sx={{ marginTop: 2, mb: 2 }}>
                        <FormLabel component="legend">Tipo de transacción</FormLabel>
                        <RadioGroup
                            row
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense')}
                        >
                            <FormControlLabel value="income" control={<Radio />} label="Ingreso" />
                            <FormControlLabel value="expense" control={<Radio />} label="Gasto" />
                        </RadioGroup>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                    >
                        Crear transacción
                    </Button>
                </form>
            </LocalizationProvider>
        </Box>
    );
};

export default TransactionForm;