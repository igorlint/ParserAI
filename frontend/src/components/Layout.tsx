import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          G. Stocks
        </Typography>
        <Button color="inherit" component={Link} to="/">Warehouses</Button>
        <Button color="inherit" component={Link} to="/history">History</Button>
        <Button color="inherit" component={Link} to="/reserve">Reserve</Button>
      </Toolbar>
    </AppBar>
    <Box component="main" sx={{ padding: 2 }}>
      {children}
    </Box>
  </>
);

export default Layout;
