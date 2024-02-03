// src/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';

import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#000000', 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        sizeLarge: {
          height: '40px',
          paddingLeft: '34px',
          paddingRight: '34px',
        },
        sizeSmall: {
          height: '32px',
          paddingLeft: '14px',
          paddingRight: '14px',
        },
      },
    },
  },
});

export default theme;
