import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Grid, Paper, Typography, Box, Alert } from '@mui/material';

interface CategorySummary {
  label: string;
  amount: number;
  color?: string;
  icon?: React.ReactNode;
}

export default function CategorySummaryCards({ title }: { title?: string }) {
  const [data, setData] = useState<CategorySummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeCategories: (() => void) | null = null;
    let unsubscribeTransactions: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setData([]);
        setError('Debes estar logueado para ver el resumen de categorías.');
        return;
      }

      const categoriesRef = collection(db, 'users', user.uid, 'categories');
      const transactionsRef = collection(db, 'users', user.uid, 'transactions');

      unsubscribeCategories = onSnapshot(categoriesRef, (catSnap) => {
        const categories = catSnap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        unsubscribeTransactions = onSnapshot(transactionsRef, (txSnap) => {
          const expenseMap: Record<string, number> = {};
          txSnap.forEach((doc) => {
            const data = doc.data();
            if (data.type === 'expense' && data.category) {
              expenseMap[data.category] = (expenseMap[data.category] || 0) + Number(data.amount);
            }
          });

          setData(
            categories.map((cat) => ({
              label: cat.name,
              amount: expenseMap[cat.name] || 0,
              
            }))
          );
        });
      });
    });

    return () => {
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeTransactions) unsubscribeTransactions();
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
    };
  }, []);

  return (
    <Box sx={{ mt: 4, pt: 2 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        {data.map((cat) => (
          <Grid key={cat.label} size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                background: cat.color || '#1976d2',
                color: '#fff',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // Align content to the left
                borderRadius: 3,
                aspectRatio: '1 / 1',
                minHeight: 0,
                justifyContent: 'flex-start', // Align content to the top
                maxWidth: 120, // smaller square
                mx: 'auto',
                pt: 2, // Padding top for the content
              }}
            >
              {cat.icon && <Box sx={{ fontSize: 28, mb: 1 }}>{cat.icon}</Box>}
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {cat.label}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {cat.amount.toLocaleString()}€
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}