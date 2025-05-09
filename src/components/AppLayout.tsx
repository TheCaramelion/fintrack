import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import TopAppBar from './TopAppBar';
import SideDrawer from './SideDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      signOut(auth);
      console.log('User logged out.');
      navigate('/');
    } catch (error) {
      console.error('Error singing out: ', error)
    }
  };

  return (
    <>
      <TopAppBar
        onMenuClick={() => setDrawerOpen(true)}
        anchorEl={anchorEl}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigation}
      />
      <main style={{ marginTop: 64, marginLeft: drawerOpen ? 250 : 0, transition: 'margin 0.3s' }}>
        {children}
      </main>
    </>
  );
};

export default AppLayout;