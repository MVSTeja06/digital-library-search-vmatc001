import { Navigate, Route, useRoutes } from 'react-router-dom';
// layouts
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, OutlinedInput, InputAdornment, Button, TextField, Box, IconButton, Grid } from '@mui/material';
// component
import { v4 as uuidv4 } from 'uuid';

import Iconify from '../../../components/Iconify';
import CreateETD from './CreateETD';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 1, 0),
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

  const [showApiKey, setShowApiKey] = useState(true);

  const [uuidValue, setUuidValue] = useState(true);

  useEffect(() => {
    const uuidv4Val = uuidv4();
    localStorage.setItem('uuidv4', uuidv4Val);
    setUuidValue(uuidv4Val);
  }, []);

  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

  return (
    <>
      <RootStyle>
        <Grid container sm={12}>
          <Grid item md={12} lg={5}>
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
          </Grid>
          {isLoggedIn && (
            <Grid
              sx={{
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                mt: 1,
              }}
              md={12}
              lg={7}
            >
              <Grid container item md={8} sm={10} sx={{ justifyContent: 'flex-start' }}>
                <Grid item xs={3} display="flex">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setShowApiKey(!showApiKey);
                    }}
                  >
                    API Key
                  </Button>
                </Grid>
                <Grid item xs={9} display="flex">
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    disabled={showApiKey}
                    value={showApiKey ? '' : uuidValue}
                    sx={{
                      minWidth: '200px',
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container item md={4} sm={2} display="flex" sx={{ mt: 1, ml: 1 }} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleClickOpen} size="medium">
                  Create ETD
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </RootStyle>
      <CreateETD open={open} handleClose={handleClose} />
    </>
  );
}
