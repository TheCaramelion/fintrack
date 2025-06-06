import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Transaction {
    id: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    createdAt: { seconds: number; nanoseconds: number };
}

const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            const user = auth.currentUser;

            if (!user) {
                setError('Debes estar logueado para ver las transacciones.');
                return;
            }

            try {
                const transactionsRef = collection(db, 'users', user.uid, 'transactions');
                const querySnapshot = await getDocs(transactionsRef);

                const transactionsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Transaction[];

                setTransactions(transactionsData);
            } catch (err: unknown) {
                setError('No se pudieron obtener las transacciones. Por favor, inténtalo de nuevo.');
                console.error('Error al obtener las transacciones:', err);
            }
        };

        fetchTransactions();
    }, []);

    return { transactions, error };
};

export default useTransactions;