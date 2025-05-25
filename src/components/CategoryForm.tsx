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
        setError('You must be logged in to create a category.');
        return;
    }

    if (!categoryName.trim()) {
        setError('Category name cannot be empty.');
        return;
    }

    try {
        const categoriesRef = collection(db, 'users', user.uid, 'categories');

        await addDoc(categoriesRef, {
        name: categoryName,
        createdAt: new Date(),
        });

        setSuccess('Category created successfully!');
        setCategoryName('');
    } catch (err: unknown) {
        setError('Failed to create category. Please try again.');
        console.error('Error creating category:', err);
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
        <Typography variant="h6">Create a New Category</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
        <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
        />
        <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
        >
            Create Category
        </Button>
        </form>
    </Box>
    );
};

export default CategoryForm;