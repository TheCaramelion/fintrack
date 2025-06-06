import { type FormEvent, useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import GoogleIcon from '@mui/icons-material/Google';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = {
        email: user.email,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      setSuccess('¡Usuario registrado exitosamente!');
      //navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    setSuccess(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = {
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      setSuccess('¡Usuario registrado exitosamente!');
      //navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Registrarse
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleGoogleRegister}
            startIcon={<GoogleIcon />}
          >
            Registrarse con Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
}