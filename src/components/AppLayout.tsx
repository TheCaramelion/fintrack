import { useState, useEffect, type FunctionComponent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';
import SideDrawer from './SideDrawer';
import TopAppBar from './TopAppBar';
import MiniRail from './MiniRail';
import { useTheme, useMediaQuery } from '@mui/material';

interface AppLayoutProps {
  children: ReactNode;
}

const miniDrawerWidth = 56;

const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    try {
      signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión: ', error)
    }
  };

  return (
    <>
      {!isSmallScreen && <MiniRail onNavigate={handleNavigation} />}
      <TopAppBar
        drawerOpen={drawerOpen}
        onDrawerOpen={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        photoURL={user?.photoURL ?? undefined}
      />
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        photoURL={user?.photoURL ?? undefined}
      />
      <main style={{ 
        marginTop: 64, 
        marginLeft: isSmallScreen ? 0 : miniDrawerWidth,
        transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}>
        {children}
      </main>
    </>
  );
};

export default AppLayout;