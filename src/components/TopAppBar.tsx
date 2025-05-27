import type { FunctionComponent } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface TopAppBar {
  onMenuClick: () => void;
  anchorEl: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  photoURL?: string;
}

const CustomAppBar: FunctionComponent<TopAppBar> = ({
  onMenuClick,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onNavigate,
  onLogout,
  photoURL,
}) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={onMenuOpen}
          color="inherit"
          sx={{ marginLeft: 'auto'}}
        >
          {photoURL ? (
            <Avatar src={photoURL} alt="Profile" />
          ) : (
            <AccountCircle fontSize='large'/>
          )}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={onMenuClose}
        >
          <MenuItem onClick={() => onNavigate('/profile')}>Profile</MenuItem>
          <MenuItem onClick={() => onNavigate('/settings')}>Settings</MenuItem>
          <MenuItem onClick={onLogout}>Log Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;