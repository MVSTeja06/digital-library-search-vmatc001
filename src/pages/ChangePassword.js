import { filter } from 'lodash';
import * as Yup from 'yup';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Container,
  Typography,
  InputAdornment,
  styled,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';

import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { FormProvider, RHFTextField } from '../components/hook-form';

import Page from '../components/Page';

import fireBaseInit from '../utils/firebase-init';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 880,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function ChangePassword() {
  const navigate = useNavigate();

  const [openAPIToast, setOpenAPIToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const handleAPIToastClose = () => {
    setOpenAPIToast(false);
  };

  const RegisterSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password required'),
    newPassword1: Yup.string().required('New password required'),
    newPassword2: Yup.string().required('Re-enter new password required'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword1: '',
    newPassword2: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues,
    getFieldState,
    setError,
    clearErrors
  } = methods;

  const [authSucces, setAuthSucces] = useState(false);

  const handleOldPasswordCheck = async (evt) => {
    const oldPasswordFromForm = getValues('oldPassword');
    const oldPassword = evt.target.value;
    try {
      clearErrors('oldPassword');
      const auth = getAuth(fireBaseInit);
      const user = auth.currentUser;
      const userEmail = localStorage.getItem('userEmail');

      console.log(auth.currentUser || userEmail)
      const credential = EmailAuthProvider.credential(auth.currentUser.email || userEmail, oldPassword);
      await reauthenticateWithCredential(user, credential);
      setAuthSucces(true);
    } catch (error) {
      console.log(error);
      setAuthSucces(false);
      setError('oldPassword', { type: 'custom', message: 'Password does not match your current password.' });
    }
  };

  const onSubmit = async (data) => {
    if (authSucces) {
      if (data.newPassword1 === data.newPassword2) {
        clearErrors('newPassword1');
        try {
          const auth = getAuth(fireBaseInit);
          const user = auth.currentUser;
          await updatePassword(user, data.newPassword1);

          setToastMessage('Password updated successfully');
          setOpenAPIToast(true);
          setSeverity('success');
        } catch (error) {
          setSeverity('error');
          setToastMessage('Failed to update password');
          setOpenAPIToast(true);
        }
      } else {
        setError('newPassword1', { type: 'custom', message: 'New Password does not match re-enter password' });
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <Page title="Profile">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
        </Stack>

        <Card>
          <Container>
            <ContentStyle>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="oldPassword"
                      type="password"
                      label="Old password"
                      onBlur={handleOldPasswordCheck}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField name="newPassword1" type="password" label="New password" />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField name="newPassword2" type="password" label="Re-enter password" />
                  </Grid>
                  <Grid item xs={12} spacing={2}>
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                      Save
                    </LoadingButton>
                  </Grid>
                </Grid>
              </FormProvider>
            </ContentStyle>
          </Container>
        </Card>
      </Container>
      <Snackbar open={openAPIToast} autoHideDuration={6000} onClose={handleAPIToastClose}>
        <Alert onClose={handleAPIToastClose} severity={severity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Page>
  );
}
