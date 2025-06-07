import type { FunctionComponent } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

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
        <MenuIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default TopAppBar;