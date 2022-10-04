import { Snackbar } from '@mui/material';
import React, { createContext, useState } from 'react';

export const SnackbarContext = createContext(null);

export function SnackbarComponent({ children }) {
  // Current open state
  const [open, setOpen] = useState(false);

  const openSnackbar = () => {
    if (open === true) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const closeSnackbar = () => {
    setOpen(false);
  };
  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackbar} message="Note archived" />
      {children}
    </SnackbarContext.Provider>
  );
}
