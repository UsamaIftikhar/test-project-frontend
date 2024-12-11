import * as React from 'react';
import Head from 'next/head';
import { CssBaseline } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS (if any)
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>My App</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* Material UI's CssBaseline for consistent styling */}
      <CssBaseline />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
