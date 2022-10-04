import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';

// components
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import MenuPopover from '../../components/MenuPopover';
// mocks_
// import account from '../../_mock/account';
import fireBaseInit from '../../utils/firebase-init';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: 'profile',
  },
  {
    label: 'Change Password',
    icon: 'eva:settings-2-fill',
    linkTo: 'changepassword',
  },
];

// ----------------------------------------------------------------------
const auth = getAuth(fireBaseInit);
const db = getFirestore(fireBaseInit);

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleClose();
      navigate('/login');
      console.log('logged out>>>');
    } catch (error) {
      console.error(error);
    }
  };

  const [account, setAccount] = useState({});
  useEffect(() => {
    
    if(open){
      const usersTable = collection(db, 'users');

      const getAccountDetails = async () => {
        const userEmail =localStorage.getItem('userEmail');

        console.log("auth.currentUser", auth)
        const snapshot = await query(usersTable, where('email', '==', userEmail));
        const result = await getDocs(snapshot);
        console.log(result.docs[0].data());
        setAccount(result.docs[0].data());
      };
      getAccountDetails();

    }
  }, [open]);

  console.log({ open });
  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.firstName} {account.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
