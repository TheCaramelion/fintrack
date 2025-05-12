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
    Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TransactionList = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    useEffect(() => {
    const fetchTransactions = async () => {
        const user = auth.currentUser;

        if (!user) {
        setError('You must be logged in to view transactions.');
        return;
        }

        try {
        const transactionsRef = collection(db, 'users', user.uid, 'transactions');
        const querySnapshot = await getDocs(transactionsRef);

        const transactionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setTransactions(transactionsData);
        } catch (err: unknown) {
        setError('Failed to fetch transactions. Please try again.');
        console.error('Error fetching transactions:', err);
        }
    };

    fetchTransactions();
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
    console.log('Edit transaction:', transactionId);
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
                primary={`${transaction.category} - $${transaction.amount}`}
                secondary={new Date(transaction.createdAt.seconds * 1000).toLocaleDateString()}
                />
                <Chip
                label={transaction.type === 'income' ? 'Income' : 'Expense'}
                color={transaction.type === 'income' ? 'success' : 'error'}
                sx={{ marginLeft: 2 }}
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
    </Box>
    );
};

export default TransactionList;