import { useState, FormEvent } from 'react';
import { Box, Grid, Typography, Button, Divider, TextField, Link as MuiLink, Paper, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useUserContext } from '../context/UserContext';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserDoc } = useUserContext();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUserDoc = {
          email: user.email,
          lastLogin: new Date(),
        };

        await setDoc(userDocRef, newUserDoc);
        setUserDoc(newUserDoc);
      } else {
        setUserDoc(userDoc.data());
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUserDoc = {
          email: user.email,
          lastLogin: new Date(),
        };
        await setDoc(userDocRef, newUserDoc);
        setUserDoc(newUserDoc);
      } else {
        setUserDoc(userDoc.data());
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ minHeight: '90vh', width: '80vw', borderRadius: 0 }}>
      <Grid container sx={{ minHeight: '90vh' }}>
        <Grid size={{ xs: 12, md: 5}} sx={{ bgcolor: '#0a2239', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Bienvenido a FinTrack
          </Typography>
          <Box sx={{ width: '100%', height: 6, bgcolor: '#00e676', borderRadius: 3, mb: 3 }} />
          <Typography variant="h6" sx={{ opacity: 0.8 }}>
            Inicia sesión para continuar con tu cuenta.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 7}} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', bgcolor: '#fff' }}>
          <Box sx={{ width: '80%', maxWidth: 400 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ mb: 2, textTransform: 'none' }}
              onClick={handleGoogleLogin}
            >
              Continuar con Google
            </Button>
            <Divider sx={{ my: 3 }}>O</Divider>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo electrónico"
                variant="outlined"
                sx={{ mb: 2 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{ mb: 2, textTransform: 'none', fontWeight: 'bold', fontSize: 18, marginTop: 1 }}
              >
                Iniciar sesión
              </Button>
            </form>
            <Typography align="center" sx={{ mt: 2 }}>
              ¿Aún no tienes cuenta?{' '}
              <MuiLink component={Link} to="/register" underline="hover" color="primary" fontWeight="bold">
                Regístrate.
              </MuiLink>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}