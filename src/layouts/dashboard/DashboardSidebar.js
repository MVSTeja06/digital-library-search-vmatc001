import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Box, Link, Drawer as MuiDrawer, Typography, Avatar, Stack, IconButton, Divider } from '@mui/material';

// mock
// import account from '../../_mock/account';
// hooks
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import fireBaseInit from '../../utils/firebase-init';
import useResponsive from '../../hooks/useResponsive';
// components
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 1,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

const auth = getAuth(fireBaseInit);
const db = getFirestore(fireBaseInit);

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {

  console.log({ isOpenSidebar })

  const isDesktop = useResponsive('up', 'lg');


  const [account, setAccount] = useState({});
  useEffect(() => {
    const usersTable = collection(db, 'users');

    const getAccountDetails = async () => {
      const userEmail = localStorage.getItem('userEmail');

      console.log('auth.currentUser', auth);
      const snapshot = await query(usersTable, where('email', '==', userEmail));
      const result = await getDocs(snapshot);
      console.log(result.docs[0].data());
      setAccount(result.docs[0].data());
    };
    getAccountDetails();
  }, []);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >

      <Box sx={{ my: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="/">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {account.firstName} {account.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          <Divider />
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          variant="permanent"
          anchor="left"
        >
          <DrawerHeader>
            <IconButton onClick={() => {
              onCloseSidebar()
            }}>
              {isOpenSidebar ? (
                <Iconify icon="eva:arrow-back-outline" />
              ) : (
                <Iconify icon="eva:arrow-forward-outline" />
              )}
            </IconButton>
          </DrawerHeader>
          {renderContent}
        </Drawer>
      )}
    </>
  );
}
