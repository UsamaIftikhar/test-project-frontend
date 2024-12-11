import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            My App
          </Link>
        </Typography>

        {session ? (
          <>
            <Button color="inherit" onClick={() => signOut()}>
              Logout
            </Button>
            <Link href="/dashboard" passHref>
              <Button color="inherit">Dashboard</Button>
            </Link>
          </>
        ) : (
          <Button color="inherit" onClick={() => signIn()}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
