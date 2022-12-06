import Button from '@mui/material/Button';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { DatePicker } from '@mui/lab';
import { Box } from '@mui/system';
import { FormControl, FormControlLabel, FormHelperText, IconButton, Typography } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

const createETDSchema = Yup.object().shape({
  abstract: Yup.string().required('Abstract is required'),
  advisor: Yup.string().required('Abstract is required'),
  program: Yup.string().required('Program is required'),
  university: Yup.string().required('University is required'),
  author: Yup.string().required('Author is required'),
  degree: Yup.string().required('Degree is required'),
  title: Yup.string().required('Title is required'),
  year: Yup.number().required('Year is required'),
  file: Yup.mixed().test('required', 'You need to provide a file', (file) => {
    console.log({ file });
    if (file) return true;
    return false;
  }),
});

export default function CreateETD({ open, handleClose }) {
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleInsertEntry = async (data) => {
    console.log({ data });

    const formData = new FormData();
    // formData.append("")
    formData.append('abstract', data.abstract);
    formData.append('advisor', data.advisor);
    formData.append('author', data.author);
    formData.append('program', data.program);
    formData.append('university', data.university);
    formData.append('degree', data.degree);
    formData.append('title', data.title);
    formData.append('year', data.year);
    formData.append('file', fileToUpload);

    const config = {
      method: 'post',
      url: 'http://localhost:3001/api/insertDocument',
      data: formData,
    };

    const result = await axios(config);

    console.log(result);
    doHandleClose();
  };

  const defaultValues = {
    abstract: '',
    advisor: '',
    author: '',
    program: '',
    university: '',
    degree: '',
    title: '',
    year: '',
  };

  const methods = useForm({
    resolver: yupResolver(createETDSchema),
    // defaultValues,
  });

  const {
    handleSubmit,
    resetField,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    register,
  } = methods;

  const doHandleClose = () => {
    reset({});
    handleClose();
    setFileToUpload('');
  };

  const onCancelFileUpload = () => {
    resetField('file');
    setFileToUpload(null);
  };
  return (
    <Dialog open={open} onClose={doHandleClose}>
      <DialogTitle>New ETD Entry</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleInsertEntry)}>
        <DialogContent>
          <RHFTextField gutterBottom name="author" label="Author" type="text" fullWidth variant="standard" />
          <RHFTextField gutterBottom name="abstract" label="Abstract" type="text" fullWidth variant="standard" />
          <RHFTextField gutterBottom name="advisor" label="Advisor" type="text" fullWidth variant="standard" />
          <RHFTextField gutterBottom name="title" label="Title" type="text" fullWidth variant="standard" />
          <RHFTextField gutterBottom name="year" label="Year" type="text" fullWidth variant="standard" />
          <RHFTextField gutterBottom name="degree" label="Degree" type="text" fullWidth variant="standard" />
          <RHFTextField gutterBottom name="program" label="Program" type="text" fullWidth variant="standard" />
          <RHFTextField gutterBottom name="university" label="University" type="text" fullWidth variant="standard" />
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
              <input
                {...register('file')}
                type="file"
                name="file"
                id="pdf"
                hidden
                onChange={(e) => {
                  setFileToUpload(e.target.files[0]);
                  clearErrors('file');
                }}
              />
            </Button>
            <Typography align="center" variant="subtitle1" ml={2}>
              {fileToUpload?.name}
            </Typography>
            <FormControl error={errors.file}>
              {fileToUpload && (
                <IconButton onClick={onCancelFileUpload}>
                  <Iconify icon="eva:close-fill" width={20} height={20} />
                </IconButton>
              )}
              {errors.file && <FormHelperText>{errors.file.message}</FormHelperText>}
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={doHandleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </Box>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}

{
  /* <DatePicker
            label="Date"
            value={dateValue}
            onChange={(newValue) => {
              setDateValue(newValue);
            }}
            renderInput={(params) => <RHFTextField {...params} variant="standard" fullWidth />}
          /> */
}
