import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, doc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        let unsubscribeCategories: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setError('Debes estar logueado para ver las categorías.');
                setCategories([]);
                return;
            }

            const categoriesRef = collection(db, 'users', user.uid, 'categories');
            unsubscribeCategories = onSnapshot(
                categoriesRef,
                (querySnapshot) => {
                    const categoriesData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setCategories(categoriesData);
                },
                (err) => {
                    setError('Error al obtener las categorías. Por favor, inténtalo de nuevo.');
                    console.error('Error al obtener las categorías:', err);
                }
            );
        });

        return () => {
            if (unsubscribeCategories) unsubscribeCategories();
            unsubscribeAuth();
        };
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
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
            setCategoryToEdit(category);
            setEditName(category.name);
            setEditDialogOpen(true);
        }
    };

    const handleEditSave = async () => {
        if (!categoryToEdit) return;
        const user = auth.currentUser;
        if (!user) {
            setError('Debes estar logueado para editar categorías.');
            return;
        }
        try {
            const categoryDocRef = doc(db, 'users', user.uid, 'categories', categoryToEdit.id);
            await updateDoc(categoryDocRef, { name: editName });
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === categoryToEdit.id ? { ...cat, name: editName } : cat
                )
            );
            setEditDialogOpen(false);
            setCategoryToEdit(null);
        } catch (err: any) {
            setError('Error al editar la categoría. Por favor, inténtalo de nuevo.');
            console.error('Error al editar la categoría:', err);
        }
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

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                aria-labelledby="edit-dialog-title"
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: { minWidth: 320, maxWidth: 360 }
                    }
                }}
            >
                <DialogTitle id="edit-dialog-title">Editar Categoría</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <DialogContentText sx={{ width: '100%', maxWidth: 280, textAlign: 'center' }}>
                        Modifica el nombre de la categoría.
                    </DialogContentText>
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{
                            width: '100%',
                            maxWidth: 280,
                            marginTop: 16,
                            padding: 8,
                            fontSize: 16,
                            boxSizing: 'border-box'
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleEditSave} color="success" autoFocus>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CategoryList;