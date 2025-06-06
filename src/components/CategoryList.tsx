import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Alert,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryList = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const user = auth.currentUser;

            if (!user) {
                setError('Debes estar logueado para ver las categorías.');
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
                setError('Error al obtener las categorías. Por favor, inténtalo de nuevo.');
                console.error('Error al obtener las categorías:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        const user = auth.currentUser;
        if (!user) {
            setError('Debes estar logueado para borrar categorías.');
            return;
        }

        try {
            const categoryDocRef = doc(db, 'users', user.uid, 'categories', categoryToDelete);
            await deleteDoc(categoryDocRef);

            setCategories((prev) => prev.filter((category) => category.id !== categoryToDelete));
            setCategoryToDelete(null);
            setDeleteDialogOpen(false);
        } catch (err: any) {
            setError('Error al borrar la categoría. Por favor, inténtalo de nuevo.');
            console.error('Error al borrar la categoría:', err);
        }
    };

    const handleEdit = (categoryId: string) => {
        console.log('Editar categoría:', categoryId);
    };

    const openDeleteDialog = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setCategoryToDelete(null);
        setDeleteDialogOpen(false);
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
            <Typography variant="h6">Categorías</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {categories.length > 0 ? (
                <List sx={{ overflowY: 'auto'}}>
                    {categories.map((category) => (
                        <ListItem
                            key={category.id}
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        aria-label="editar"
                                        onClick={() => handleEdit(category.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="borrar"
                                        onClick={() => openDeleteDialog(category.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText primary={category.name} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No se han encontrado categorías.</Typography>
            )}

            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Borrar Categoría</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Borrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CategoryList;