import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { DatePicker } from '@mui/lab';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    phone: Yup.string().phone().required('Phone number is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

export default function CreateETD({ open, handleClose }) {
  const [dateValue, setDateValue] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleInsertEntry = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    console.log(evt.target.elements);
    console.log(evt.target.email.value);
  };

  const defaultValues = {
    email: '',
    abstract: '',
    advisor: '',
    department: '',
    program: '',
    university: '',
    author: '',
    degree: '',
    title: '',
    year: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New ETD Entry</DialogTitle>
        <form onSubmit={handleInsertEntry}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              required
            />
            <TextField required margin="dense" name="author" label="Author" type="text" fullWidth variant="standard" />
            <TextField
              required
              margin="dense"
              name="abstract"
              label="Abstract"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              name="advisor"
              label="Advisor"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField required margin="dense" name="title" label="Title" type="text" fullWidth variant="standard" />
            <TextField
              required
              margin="dense"
              name="department"
              label="Department"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField required margin="dense" name="degree" label="Degree" type="text" fullWidth variant="standard" />
            <TextField
              required
              margin="dense"
              name="program"
              label="Program"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              name="university"
              label="University"
              type="text"
              fullWidth
              variant="standard"
            />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Button variant="contained" component="label">
                Upload File
                <input type="file" name="pdf" id="pdf" hidden onChange={(e) => setFileToUpload(e.target.files[0])} />
              </Button>
              <Typography gutterBottom align="center" variant="subtitle1" ml={2}>
                {fileToUpload?.name}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

{
  /* <DatePicker
            label="Date"
            value={dateValue}
            onChange={(newValue) => {
              setDateValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} variant="standard" fullWidth />}
          /> */
}
