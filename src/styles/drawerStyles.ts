export const drawerHeaderStyle = {
  backgroundColor: 'primary.main',
  color: 'white',
  padding: '16px',
  textAlign: 'center',
};

export const drawerBoxStyle = {
  width: 250,
};

export const drawerListItemStyle = {
  transition: 'box-shadow 0.2s, background 0.2s, border 0.2s',
  background: 'transparent',
  border: 'none',
  borderRadius: 2,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 3,
    background: 'transparent',
    border: 'none',
  },
  '&:focus': {
    outline: 'none',
  },
  textAlign: 'left',
  width: '100%',
  padding: '8px 16px',
};