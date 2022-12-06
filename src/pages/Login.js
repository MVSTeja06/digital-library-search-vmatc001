import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
// hooks
import { useState } from 'react';
import { Box } from '@mui/system';
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';
import Search from './Search';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  // position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'end',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  height: '50vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const [open, setOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          {/* <Logo /> */}
          <Button onClick={handleClickOpen}>Login</Button>

          {smUp && (
            <Typography variant="body2">
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        <Box sx={{ display: 'flex' }}>
          {mdUp && (
            <Box>
              <SectionStyle>
                <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                  Hi, Welcome Back
                </Typography>
                <img src="/static/illustrations/welcome-back.png" alt="login" />
              </SectionStyle>
            </Box>
          )}
          <Box sx={{ mt: 3, width: '100%', ml: 3 }}>
            <Search isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </Box>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Typography variant="h4" gutterBottom>
              Sign in to Digital library with Wiki Cards
            </Typography>
          </DialogTitle>

          <DialogContent>
            <SignInSection smUp={smUp} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </DialogContent>
        </Dialog>
      </RootStyle>
    </Page>
  );
}

const SignInSection = ({ smUp, isLoggedIn, setIsLoggedIn }) => (
  <ContentStyle>
    {/* <Typography variant="h4" gutterBottom>
      Sign in to Digital library with Wiki Cards
    </Typography> */}

    <Typography sx={{ color: 'text.secondary', mb: 2 }}>Enter your login details below.</Typography>

    <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>

    {!smUp && (
      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don’t have an account?{' '}
        <Link variant="subtitle2" component={RouterLink} to="/register">
          Get started
        </Link>
      </Typography>
    )}
  </ContentStyle>
);
