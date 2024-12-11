import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">My App</Typography>
      </Toolbar>
    </AppBar>
    <Navbar />
    <Container>{children}</Container>
  </>
);

export default Layout;
