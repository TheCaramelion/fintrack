import type { FunctionComponent } from 'react';
import { Drawer, Box, List, IconButton, ListItemButton, ListItemText, Typography, Avatar, Divider } from '@mui/material';
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

const drawerWidth = 280;

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
    sx={{ width: drawerWidth }}
    slotProps={{
      paper: {
        sx: { width: drawerWidth }
      }
    }}
  >
    <Box sx={{
      ...drawerHeaderStyle,
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      py: 2,
      mb: 1,
    }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          letterSpacing: 2,
          textAlign: 'center',
          width: '100%',
        }}
      >
        Fintrack
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
        bgcolor: 'grey.50',
        borderRadius: 2,
        mx: 2,
        mb: 1,
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
          boxShadow: 2,
          bgcolor: 'background.paper',
        }}
      >
        {photoURL ? (
          <Avatar src={photoURL} alt="Perfil" sx={{ width: 96, height: 96 }} />
        ) : (
          <AccountCircle sx={{ width: 96, height: 96 }} />
        )}
      </IconButton>
      {auth.currentUser?.email && (
        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            mt: 1,
            color: 'text.secondary',
            fontStyle: 'italic',
            fontSize: '0.95rem',
          }}
        >
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
              sx={{
                ...drawerListItemStyle,
                color: item.label === 'General' ? 'primary.main' : 'inherit',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                },
              }}
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
            sx={{
              ...drawerListItemStyle,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'white',
              },
            }}
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  </Drawer>
);

export default SideDrawer;