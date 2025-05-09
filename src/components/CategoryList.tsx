import React, { useEffect, useState } from 'react';
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

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    useEffect(() => {
    const fetchCategories = async () => {
        const user = auth.currentUser;

        if (!user) {
        setError('You must be logged in to view categories.');
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

    const handleDelete = async () => {
    if (!categoryToDelete) return;

    const user = auth.currentUser;
    if (!user) {
        setError('You must be logged in to delete categories.');
        return;
    }

    try {
        const categoryDocRef = doc(db, 'users', user.uid, 'categories', categoryToDelete);
        await deleteDoc(categoryDocRef);

        setCategories((prev) => prev.filter((category) => category.id !== categoryToDelete));
        setCategoryToDelete(null);
        setDeleteDialogOpen(false);
    } catch (err: any) {
        setError('Failed to delete category. Please try again.');
        console.error('Error deleting category:', err);
    }
    };

    const handleEdit = (categoryId: string) => {
    console.log('Edit category:', categoryId);
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
        <Typography variant="h6">Your Categories</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {categories.length > 0 ? (
        <List>
            {categories.map((category) => (
            <ListItem
                key={category.id}
                secondaryAction={
                <>
                    <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(category.id)}
                    >
                    <EditIcon />
                    </IconButton>
                    <IconButton
                    edge="end"
                    aria-label="delete"
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
        <Typography>No categories found.</Typography>
        )}

        <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        >
        <DialogTitle id="delete-dialog-title">Delete Category</DialogTitle>
        <DialogContent>
            <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this category? This action cannot be undone.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
            Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
            Delete
            </Button>
        </DialogActions>
        </Dialog>
    </Box>
    );
};

export default CategoryList;