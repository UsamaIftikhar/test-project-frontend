import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        background: 'linear-gradient(to bottom, #e3f2fd, #90caf9)',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to My App
      </Typography>

      {!session ? (
        <>
          <Typography variant="h6" gutterBottom>
            Please log in to continue
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => signIn()}
            size="large"
          >
            Login
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Hello, {session.user?.email || 'User'}!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => signOut()}
            size="large"
          >
            Logout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Home;
