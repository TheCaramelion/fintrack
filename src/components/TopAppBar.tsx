import type { FunctionComponent } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface TopAppBarProps {
  drawerOpen: boolean;
  onDrawerOpen: () => void;
  onDrawerClose: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  photoURL?: string;
}

const TopAppBar: FunctionComponent<TopAppBarProps> = ({
  onDrawerOpen,
  photoURL,
}) => (
  <AppBar position="fixed">
    <Toolbar>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menú"
        sx={{ mr: 2 }}
        onClick={onDrawerOpen}
      >
        {photoURL ? (
          <Avatar src={photoURL} alt="Perfil" />
        ) : (
          <AccountCircle fontSize="large" />
        )}
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default TopAppBar;