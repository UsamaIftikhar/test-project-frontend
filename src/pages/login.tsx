import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { loginSchema } from '../validationSchemas/loginSchema'; // Import Yup schema
import { ValidationError } from 'yup';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setFormError('');
  
    try {
      // Validate input fields using Yup schema
      await loginSchema.validate({ email, password }, { abortEarly: false });
  
      setIsLoading(true);
  
      // Perform sign-in using NextAuth credentials provider
      const result = await signIn('credentials', {
        redirect: false, // Prevent default redirect
        email,
        password,
      });
  
      setIsLoading(false);
  
      if (result?.error) {
        // Handle invalid credentials
        setFormError('Invalid email or password');
      } else {
        // Fetch the current session
        const session = await getSession();
  
        if (session?.user?.accessToken) {
          // Store the access token in local storage
          localStorage.setItem('token', session.user.accessToken);
          console.log('Access token stored in local storage:', session.user.accessToken);
        }
  
        // Redirect to the dashboard
        router.push('/dashboard');
      }
    } catch (validationError) {
      if (validationError instanceof ValidationError) {
        validationError.inner.forEach((err) => {
          if (err.path === 'email') setEmailError(err.message);
          if (err.path === 'password') setPasswordError(err.message);
        });
      }
    }
  };  

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #e3f2fd, #90caf9)',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!emailError}
        helperText={emailError}
        fullWidth
        sx={{ mb: 2, maxWidth: 400 }}
        disabled={isLoading}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        fullWidth
        sx={{ mb: 2, maxWidth: 400 }}
        disabled={isLoading}
      />
      {formError && (
        <Typography color="error" gutterBottom>
          {formError}
        </Typography>
      )}
      <Box sx={{ position: 'relative', maxWidth: 400, width: '100%' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Login;
