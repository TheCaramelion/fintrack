import { useState, type FormEvent } from 'react';
import { TextField, Button, Box, Typography, Alert, ToggleButtonGroup, ToggleButton, Grid } from '@mui/material';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import CategoryIcon from '@mui/icons-material/Category';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WorkIcon from '@mui/icons-material/Work';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FlightIcon from '@mui/icons-material/Flight';
import SchoolIcon from '@mui/icons-material/School';

// Pre-set options
const COLORS = ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#ff9800', '#0097a7', '#455a64'];
const ICONS = [
    { name: 'category', icon: <CategoryIcon /> },
    { name: 'fastfood', icon: <FastfoodIcon /> },
    { name: 'car', icon: <DirectionsCarIcon /> },
    { name: 'home', icon: <HomeIcon /> },
    { name: 'lightbulb', icon: <LightbulbIcon /> },
    { name: 'celebration', icon: <CelebrationIcon /> },
    { name: 'shopping', icon: <ShoppingCartIcon /> },
    { name: 'work', icon: <WorkIcon /> },
    { name: 'creditcard', icon: <CreditCardIcon /> },
    { name: 'hospital', icon: <LocalHospitalIcon /> },
    { name: 'flight', icon: <FlightIcon /> },
    { name: 'school', icon: <SchoolIcon /> },
];

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
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {COLORS.map((c) => (
                        <Grid key={c}>
                            <Button
                                type="button"
                                variant={color === c ? 'contained' : 'outlined'}
                                onClick={() => setColor(c)}
                                sx={{
                                    minWidth: 36,
                                    minHeight: 36,
                                    bgcolor: c,
                                    border: color === c ? '2px solid #000' : undefined,
                                    '&:hover': { bgcolor: c },
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>Icono</Typography>
                <ToggleButtonGroup
                    value={icon}
                    exclusive
                    onChange={(_, val) => val && setIcon(val)}
                    sx={{ flexWrap: 'wrap', mb: 2 }}
                >
                    {ICONS.map((ic) => (
                        <ToggleButton key={ic.name} value={ic.name} sx={{ fontSize: 22, px: 2 }}>
                            {ic.icon}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

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