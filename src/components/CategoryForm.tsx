import { useState, type FormEvent } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { COLORS, ICONS } from '../constants/categoryOptions';

const CategoryForm = () => {
    const [categoryName, setCategoryName] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [icon, setIcon] = useState(ICONS[0].name);
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
                color,
                icon,
                createdAt: new Date(),
            });

            setSuccess('¡Categoría creada exitosamente!');
            setCategoryName('');
            setColor(COLORS[0]);
            setIcon(ICONS[0].name);
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
                    sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" sx={{ mb: 1 }}>Color</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                    {COLORS.map((c) => (
                        <Button
                            key={c}
                            type="button"
                            variant={color === c ? 'contained' : 'outlined'}
                            onClick={() => setColor(c)}
                            sx={{
                                minWidth: 32,
                                minHeight: 32,
                                bgcolor: c,
                                border: color === c ? '2px solid #000' : undefined,
                                '&:hover': { bgcolor: c },
                            }}
                        />
                    ))}
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>Icono</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                    {ICONS.map((ic) => (
                        <Button
                            key={ic.name}
                            type="button"
                            variant={icon === ic.name ? 'contained' : 'outlined'}
                            onClick={() => setIcon(ic.name)}
                            sx={{ minWidth: 32, minHeight: 32, fontSize: 22 }}
                        >
                            {ic.icon}
                        </Button>
                    ))}
                </Box>

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