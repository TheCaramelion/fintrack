import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
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
    Chip,
    TextField,
    MenuItem,
    Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TransactionList = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<any | null>(null);
    const [editAmount, setEditAmount] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editType, setEditType] = useState<'income' | 'expense'>('expense');

    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const user = auth.currentUser;

            if (!user) {
                setError('You must be logged in to view transactions.');
                return;
            }

            try {
                const transactionsRef = collection(db, 'users', user.uid, 'transactions');
                const unsubscribe = onSnapshot(transactionsRef, (querySnapshot) => {
                    const transactionsData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setTransactions(transactionsData);
                }, (err) => {
                    setError('Failed to fetch transactions. Please try again.');
                    console.error('Error fetching transactions:', err);
                });

                return () => unsubscribe();
            } catch (err: unknown) {
                setError('Failed to fetch transactions. Please try again.');
                console.error('Error fetching transactions:', err);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const user = auth.currentUser;
            if (!user) return;
            try {
                const catRef = collection(db, 'users', user.uid, 'categories');
                const catSnap = await getDocs(catRef);
                setCategories(catSnap.docs.map(doc => doc.data().name));
            } catch (err) {
                console.error('Error:', err)
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = async () => {
        if (!transactionToDelete) return;

        const user = auth.currentUser;
        if (!user) {
            setError('You must be logged in to delete transactions.');
            return;
        }

        try {
            const transactionDocRef = doc(db, 'users', user.uid, 'transactions', transactionToDelete);
            await deleteDoc(transactionDocRef);

            setTransactions((prev) => prev.filter((transaction) => transaction.id !== transactionToDelete));
            setTransactionToDelete(null);
            setDeleteDialogOpen(false);
        } catch (err: unknown) {
            setError('Failed to delete transaction. Please try again.');
            console.error('Error deleting transaction:', err);
        }
    };

    const handleEdit = (transactionId: string) => {
        const tx = transactions.find(t => t.id === transactionId);
        if (tx) {
            setTransactionToEdit(tx);
            setEditAmount(tx.amount);
            setEditCategory(tx.category);
            setEditType(tx.type);
            setEditDialogOpen(true);
        }
    };

    const handleEditSave = async () => {
        if (!transactionToEdit) return;
        const user = auth.currentUser;
        if (!user) {
            setError('You must be logged in to edit transactions.');
            return;
        }
        try {
            const transactionDocRef = doc(db, 'users', user.uid, 'transactions', transactionToEdit.id);
            await updateDoc(transactionDocRef, {
                amount: editAmount,
                category: editCategory,
                type: editType,
            });
            setTransactions((prev) =>
                prev.map((t) =>
                    t.id === transactionToEdit.id
                        ? { ...t, amount: editAmount, category: editCategory, type: editType }
                        : t
                )
            );
            setEditDialogOpen(false);
            setTransactionToEdit(null);
        } catch (err: unknown) {
            setError('Failed to update transaction. Please try again.');
            console.error('Error updating transaction:', err);
        }
    };

    const openDeleteDialog = (transactionId: string) => {
        setTransactionToDelete(transactionId);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setTransactionToDelete(null);
        setDeleteDialogOpen(false);
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: '0 auto',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h6">Your Transactions</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {transactions.length > 0 ? (
                <List>
                    {transactions.map((transaction) => (
                        <ListItem
                            key={transaction.id}
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleEdit(transaction.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => openDeleteDialog(transaction.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={`${transaction.category} - ${transaction.amount}€`}
                                secondary={new Date(transaction.createdAt.seconds * 1000).toLocaleDateString()}
                            />
                            <Chip
                                label={transaction.type === 'income' ? 'Income' : 'Expense'}
                                color={transaction.type === 'income' ? 'success' : 'error'}
                                sx={{ marginLeft: 2, marginRight: 2 }}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No transactions found.</Typography>
            )}

            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Delete Transaction</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this transaction? This action cannot be undone.
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

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                aria-labelledby="edit-dialog-title"
            >
                <DialogTitle id="edit-dialog-title">Edit Transaction</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Amount"
                        type="number"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Category"
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        fullWidth
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography>Type:</Typography>
                        <Chip
                            label="Income"
                            color={editType === 'income' ? 'success' : 'default'}
                            clickable
                            onClick={() => setEditType('income')}
                        />
                        <Chip
                            label="Expense"
                            color={editType === 'expense' ? 'error' : 'default'}
                            clickable
                            onClick={() => setEditType('expense')}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="success" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TransactionList;