import { FormEvent, useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
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
        console.log('New user document created:', newUserDoc);
      } else {
        setUserDoc(userDoc.data());
        console.log('User document already exists:', userDoc.data());
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
      setError(err.message)
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
          Log In
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
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
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            >
            Sign in with Google
            </Button>
        </Box>
      </Box>
    </Container>
  );
}