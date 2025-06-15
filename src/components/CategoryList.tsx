import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, writeBatch, doc, onSnapshot, updateDoc } from 'firebase/firestore';
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
import { COLORS, ICONS } from '../constants/categoryOptions';
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
    const [editColor, setEditColor] = useState(COLORS[0]);
    const [editIcon, setEditIcon] = useState(ICONS[0].name);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        let unsubscribeCategories: (() => void) | null = null;
        let unsubscribeTransactions: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setError('Debes estar logueado para ver las categorías.');
                setCategories([]);
                setCategoryCounts({});
                return;
            }

            const categoriesRef = collection(db, 'users', user.uid, 'categories');
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');

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

            unsubscribeTransactions = onSnapshot(
                transactionsRef,
                (querySnapshot) => {
                    const counts: Record<string, number> = {};
                    querySnapshot.docs.forEach((doc) => {
                        const data = doc.data();
                        if (data.category) {
                            counts[data.category] = (counts[data.category] || 0) + 1;
                        }
                    });
                    setCategoryCounts(counts);
                },
                (err) => {
                    setError('Error al obtener las transacciones.');
                    console.error('Error al obtener las transacciones:', err);
                }
            );
        });

        return () => {
            if (unsubscribeCategories) unsubscribeCategories();
            if (unsubscribeTransactions) unsubscribeTransactions();
            unsubscribeAuth();
        };
    }, []);

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        const user = auth.currentUser;
        if (!user) {
            setError('Debes estar logueado para borrar categorías.');
            setDeleteDialogOpen(false);
            return;
        }

        const categoryObject = categories.find(cat => cat.id === categoryToDelete);
        
        if (!categoryObject) {
            setError('Categoría no encontrada. No se pudo completar la eliminación.');
            console.error('Category with ID not found in state for deletion:', categoryToDelete);
            setCategoryToDelete(null);
            setDeleteDialogOpen(false);
            return;
        }
        
        const categoryNameForQuery = categoryObject.name;
        const categoryIdForDeletion = categoryToDelete;

        try {
            const categoryDocRef = doc(db, 'users', user.uid, 'categories', categoryIdForDeletion);
            
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');
            const q = query(transactionsRef, where('category', '==', categoryNameForQuery)); 
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);

            querySnapshot.forEach((transactionDoc) => {
                const transactionDocRef = doc(db, 'users', user.uid, 'transactions', transactionDoc.id);
                batch.update(transactionDocRef, { category: null });
            });

            batch.delete(categoryDocRef);

            await batch.commit();

            setCategories((prev) => prev.filter((category) => category.id !== categoryIdForDeletion));
            setCategoryToDelete(null);
            setDeleteDialogOpen(false);

        } catch (err: any) {
            console.error('Error al borrar categoría y actualizar transacciones:', err);
            setError(err.message || 'Error al borrar la categoría.');
            setDeleteDialogOpen(false);
        }
    };

    const handleEdit = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
            setCategoryToEdit(category);
            setEditName(category.name);
            setEditColor(category.color || COLORS[0]);
            setEditIcon(category.icon || ICONS[0].name);
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

            if (categoryToEdit.name !== editName) {
                const transactionsRef = collection(db, 'users', user.uid, 'transactions');
                const q = query(transactionsRef, where('category', '==', categoryToEdit.name));
                const querySnapshot = await getDocs(q);

                const batch = writeBatch(db);
                querySnapshot.forEach((transactionDoc) => {
                    const transactionDocRef = doc(db, 'users', user.uid, 'transactions', transactionDoc.id);
                    batch.update(transactionDocRef, { category: editName });
                });
                await batch.commit();
            }

            await updateDoc(categoryDocRef, { name: editName, color: editColor, icon: editIcon });
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === categoryToEdit.id
                        ? { ...cat, name: editName, color: editColor, icon: editIcon }
                        : cat
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
                            <ListItemText
                              primary={
                                <>
                                  {category.name}
                                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    ({categoryCounts[category.name] || 0})
                                  </Typography>
                                </>
                              }
                            />
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
                        Modifica el nombre, color o icono de la categoría.
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
                    <Box sx={{ mt: 2, mb: 1, width: '100%' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Color</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {COLORS.map((c) => (
                                <Button
                                    key={c}
                                    type="button"
                                    variant={editColor === c ? 'contained' : 'outlined'}
                                    onClick={() => setEditColor(c)}
                                    sx={{
                                        minWidth: 32,
                                        minHeight: 32,
                                        bgcolor: c,
                                        border: editColor === c ? '2px solid #000' : undefined,
                                        '&:hover': { bgcolor: c },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2, mb: 1, width: '100%' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Icono</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {ICONS.map((ic) => (
                                <Button
                                    key={ic.name}
                                    type="button"
                                    variant={editIcon === ic.name ? 'contained' : 'outlined'}
                                    onClick={() => setEditIcon(ic.name)}
                                    sx={{ minWidth: 32, minHeight: 32, fontSize: 22 }}
                                >
                                    {ic.icon}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={async () => {
                        await handleEditSave();
                        setEditDialogOpen(false);
                    }} color="success" autoFocus>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CategoryList;