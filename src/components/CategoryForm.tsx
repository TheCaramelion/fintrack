import { useState, type FormEvent } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CategoryForm = () => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const user = auth.currentUser;

        if (!user) {
            setError('Debes estar logueado para crear una categoría.');
            return;
        }

        if (!categoryName.trim()) {
            setError('El nombre de la categoría no puede estar vacío.');
            return;
        }

        try {
            const categoriesRef = collection(db, 'users', user.uid, 'categories');

            await addDoc(categoriesRef, {
                name: categoryName,
                createdAt: new Date(),
            });

            setSuccess('¡Categoría creada exitosamente!');
            setCategoryName('');
        } catch (err: unknown) {
            setError('No se pudo crear la categoría. Por favor, inténtalo de nuevo.');
            console.error('Error al crear la categoría:', err);
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
            <Typography variant="h6">Crear una nueva categoría</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Nombre de la categoría"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                >
                    Crear Categoría
                </Button>
            </form>
        </Box>
    );
};

export default CategoryForm;