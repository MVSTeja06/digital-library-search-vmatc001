import { Navigate, Route, useRoutes } from 'react-router-dom';
// layouts
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, OutlinedInput, InputAdornment, Button, TextField, Box, IconButton } from '@mui/material';
// component
import { v4 as uuidv4 } from 'uuid';

import Iconify from '../../../components/Iconify';
import CreateETD from './CreateETD';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 480,
  transition: theme.transitions.create(['box-shadow'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { boxShadow: theme.customShadows.z8, border: '0.5px solid lightgray' },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ filterName, onFilterName, handleSearchPress }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [showApiKey, setShowApiKey] = useState(true);

  const [uuidValue, setUuidValue] = useState(true);

  useEffect(() => {
    const uuidv4Val = uuidv4();
    localStorage.setItem('uuidv4', uuidv4Val);
    setUuidValue(uuidv4Val);
  }, []);
  return (
    <>
      <RootStyle>
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search ETD..."
          endAdornment={
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchPress}>
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </IconButton>
          }
        />

        {isLoggedIn && (
          <Box
            sx={{
              height: '50px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              size="small"
              variant="outlined"
              sx={{ marginRight: 5 }}
              onClick={() => {
                setShowApiKey(!showApiKey);
              }}
            >
              Show API Key
            </Button>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              disabled={showApiKey}
              value={showApiKey ? '' : uuidValue}
              sx={{
                minWidth: '400px'
              }}
              endAdornment
            />
          </Box>
        )}

        {isLoggedIn && (
          <Button variant="outlined" onClick={handleClickOpen}>
            New ETD Entry
          </Button>
        )}
      </RootStyle>
      <CreateETD open={open} handleClose={handleClose} />
    </>
  );
}
