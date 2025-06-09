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
        if (!categoryToDelete) return; // categoryToDelete is the ID

        const user = auth.currentUser;
        if (!user) {
            setError('Debes estar logueado para borrar categorías.');
            return;
        }

        // Find the category object from the state to get its name
        const categoryObject = categories.find(cat => cat.id === categoryToDelete);
        
        if (!categoryObject) {
            setError('Categoría no encontrada. No se pudo completar la eliminación.');
            console.error('Category with ID not found in state for deletion:', categoryToDelete);
            setCategoryToDelete(null); // Close dialog
            return;
        }
        
        const categoryNameForQuery = categoryObject.name; // Use the category NAME for querying transactions
        const categoryIdForDeletion = categoryToDelete;   // Use the category ID for deleting the category document

        try {
            const categoryDocRef = doc(db, 'users', user.uid, 'categories', categoryIdForDeletion);
            
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');
            // Query transactions where the 'category' field (which stores the name) 
            // matches the name of the category being deleted.
            const q = query(transactionsRef, where('category', '==', categoryNameForQuery)); 
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);

            querySnapshot.forEach((transactionDoc) => {
                const transactionDocRef = doc(db, 'users', user.uid, 'transactions', transactionDoc.id);
                batch.update(transactionDocRef, { category: null });
            });

            // Add deletion of the category document (using its ID) to the batch
            batch.delete(categoryDocRef);

            // Commit all batched operations
            await batch.commit();

            // Optimistically update UI
            setCategories((prev) => prev.filter((category) => category.id !== categoryIdForDeletion));
            setCategoryToDelete(null); // Close the dialog
            // Consider adding a success message if desired

        } catch (err: any) {
            console.error('Error al borrar categoría y actualizar transacciones:', err);
            setError(err.message || 'Error al borrar la categoría.');
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