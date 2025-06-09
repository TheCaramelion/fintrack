import { useEffect, useState, useRef, MouseEvent, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Paper, Typography, Box, Alert } from '@mui/material';
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

interface CategorySummary {
  label: string;
  amount: number;
  color?: string;
  icon?: ReactNode;
}

function getStartOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

const ICON_MAP: Record<string, ReactNode> = {
  category: <CategoryIcon sx={{ color: '#fff', fontSize: 20 }} />,
  fastfood: <FastfoodIcon sx={{ color: '#fff', fontSize: 20 }} />,
  car: <DirectionsCarIcon sx={{ color: '#fff', fontSize: 20 }} />,
  home: <HomeIcon sx={{ color: '#fff', fontSize: 20 }} />,
  lightbulb: <LightbulbIcon sx={{ color: '#fff', fontSize: 20 }} />,
  celebration: <CelebrationIcon sx={{ color: '#fff', fontSize: 20 }} />,
  shopping: <ShoppingCartIcon sx={{ color: '#fff', fontSize: 20 }} />,
  work: <WorkIcon sx={{ color: '#fff', fontSize: 20 }} />,
  creditcard: <CreditCardIcon sx={{ color: '#fff', fontSize: 20 }} />,
  hospital: <LocalHospitalIcon sx={{ color: '#fff', fontSize: 20 }} />,
  flight: <FlightIcon sx={{ color: '#fff', fontSize: 20 }} />,
  school: <SchoolIcon sx={{ color: '#fff', fontSize: 20 }} />,
};

export default function CategorySummaryCards({
  title,
  type: initialType = 'expense',
}: {
  title?: string;
  type?: 'expense' | 'income';
}) {
  const [data, setData] = useState<CategorySummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [type] = useState<'expense' | 'income'>(initialType);
  const scrollRef = useRef<HTMLDivElement>(null);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDown = true;
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft = scrollRef.current?.scrollLeft || 0;
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDown = false;
    document.body.style.cursor = '';
  };

  const handleMouseUp = () => {
    isDown = false;
    document.body.style.cursor = '';
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = x - startX;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

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
          icon: doc.data().icon || 'category',
          color: doc.data().color || '#1976d2',
        }));

        unsubscribeTransactions = onSnapshot(transactionsRef, (txSnap) => {
          const map: Record<string, number> = {};
          const startOfMonth = getStartOfCurrentMonth();

          txSnap.forEach((doc) => {
            const data = doc.data();
            const txDate = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
            if (
              data.type === type &&
              data.category &&
              txDate &&
              txDate >= startOfMonth
            ) {
              map[data.category] = (map[data.category] || 0) + Number(data.amount);
            }
          });

          setData(
            categories.map((cat) => ({
              label: cat.name,
              amount: map[cat.name] || 0,
              icon: ICON_MAP[cat.icon] || ICON_MAP['category'],
              color: cat.color,
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
  }, [type]);

  return (
    <Box sx={{ mt: 4, pt: 2 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 1,
          cursor: 'grab',
          userSelect: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {data.map((cat) => (
          <Paper
            key={cat.label}
            elevation={3}
            sx={{
              background: cat.color,
              color: '#fff',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderRadius: 3,
              aspectRatio: '1 / 1',
              minHeight: 0,
              justifyContent: 'flex-start',
              maxWidth: 120,
              minWidth: 120,
              position: 'relative',
              flex: '0 0 auto',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
              {cat.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {cat.amount.toLocaleString()}€
            </Typography>
            {cat.icon && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  fontSize: 36,
                  opacity: 0.7,
                  pointerEvents: 'none',
                  p: 1,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  width: '100%',
                  height: '100%',
                }}
              >
                {cat.icon}
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}