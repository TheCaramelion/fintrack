import type { FunctionComponent } from 'react';
import { Drawer, Box, List, ListItem, IconButton, ListItemButton, ListItemText, Typography, Avatar, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { drawerHeaderStyle, drawerBoxStyle, drawerListItemStyle } from '../styles/drawerStyles';
import { auth } from '../firebase';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  photoURL?: string;
  displayName?: string;
}

const drawerWidth = 240;

const menuItems = [
  { icon: <DashboardIcon />, label: 'General', path: '/dashboard' },
  { icon: <ListAltIcon />, label: 'Transacciones', path: '/transactions' },
  { icon: <CategoryIcon />, label: 'Categorías', path: '/categories' },
  { icon: <AccountCircle />, label: 'Perfil', path: '/profile' },
];

const SideDrawer: FunctionComponent<SideDrawerProps> = ({
  open,
  onClose,
  onNavigate,
  onLogout,
  photoURL,
}) => (
  <Drawer
    variant="temporary"
    anchor="left"
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: { width: drawerWidth },
    }}
  >
    <Box sx={drawerHeaderStyle}>
      <Typography variant="h6">Fintrack</Typography>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
      }}
    >
      <IconButton
        onClick={() => {
          onNavigate('/profile');
          onClose();
        }}
        sx={{
          width: 96,
          height: 96,
          mb: 1,
        }}
      >
        {photoURL ? (
          <Avatar src={photoURL} alt="Perfil" sx={{ width: 96, height: 96 }} />
        ) : (
          <AccountCircle sx={{ width: 96, height: 96 }} />
        )}
      </IconButton>
      {auth.currentUser?.email && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 1 }}>
          {auth.currentUser.email}
        </Typography>
      )}
    </Box>
    <Divider />
    <Box role="presentation" sx={{ drawerBoxStyle, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <List>
        {menuItems.map((item) =>
          item.label !== 'Perfil' && (
            <ListItemButton
              sx={drawerListItemStyle}
              key={item.label}
              onClick={() => {
                onNavigate(item.path);
                onClose();
              }}
            >
              {item.icon}
              <ListItemText primary={item.label} sx={{ ml: 2 }} />
            </ListItemButton>
          )
        )}
      </List>
      <Box>
        <List>
          <ListItemButton
            sx={drawerListItemStyle}
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
          <ListItem>
            <IconButton edge="start" color="inherit" onClick={onClose}>
              <ArrowBackIcon />
            </IconButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  </Drawer>
);

export default SideDrawer;