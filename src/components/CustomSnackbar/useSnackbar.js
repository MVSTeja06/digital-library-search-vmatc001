import { useContext } from 'react';
import { SnackbarContext } from './Snackbar';

// Custom hook to trigger the snackbar on function components
export const useSnackbar = () => {
  const { openSnackbar, closeSnackbar } = useContext(SnackbarContext);

  function open(text = '') {
    openSnackbar(text);
  }

  // Returns methods in hooks array way
  return [open, closeSnackbar];
};
