import { signIn } from 'next-auth/react';
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
      // Validate the form using Yup
      console.log('Validating:', { email, password });

      let validation = await loginSchema.validate({ email, password }, { abortEarly: false });
      console.log(
        "validation", validation
      )
      setIsLoading(true);

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      setIsLoading(false);

      if (result?.error) {
        setFormError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (validationError) {
      if (validationError instanceof ValidationError) {
        console.log('Validation Errors:', validationError.inner); // Debug errors
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
        error={!!emailError} // Displays error state if emailError exists
        helperText={emailError} // Displays the error message
        fullWidth
        sx={{ mb: 2, maxWidth: 400 }}
        disabled={isLoading}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError} // Displays error state if passwordError exists
        helperText={passwordError} // Displays the error message
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
