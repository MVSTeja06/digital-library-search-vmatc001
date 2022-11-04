import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, OutlinedInput, InputAdornment, Button } from '@mui/material';
// component
import { useState } from 'react';
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
  width: 320,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 640, boxShadow: theme.customShadows.z8 },
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

export default function UserListToolbar({ filterName, onFilterName }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <RootStyle>
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search ETD..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />

        <Button variant="outlined" onClick={handleClickOpen}>
          New ETD Entry
        </Button>
      </RootStyle>
      <CreateETD open={open} handleClose={handleClose} />
    </>
  );
}
