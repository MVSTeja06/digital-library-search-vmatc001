import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Link } from '@mui/material';

export default function Footer() {
  return (
    <Paper
      sx={{
        marginTop: 'calc(10% + 60px)',
        bottom: 0,
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'lightgray'
      }}
      component="footer"
      square
      variant="outlined"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            m: 1,
          }}
        >
          <Typography variant="caption" color="initial">
            Digital ETD library Copyright ©2022
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}
