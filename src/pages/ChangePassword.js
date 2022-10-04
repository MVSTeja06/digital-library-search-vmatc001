import { filter } from 'lodash';
import * as Yup from 'yup';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Card, Table, Stack, Avatar, Button, Container, Typography, InputAdornment, styled, Grid } from '@mui/material';
// components
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { FormProvider, RHFTextField } from '../components/hook-form';
import IconButton from '../theme/overrides/IconButton';
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import { PhoneInputField } from '../sections/auth/register/RegisterForm';
import fireBaseInit from '../utils/firebase-init';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 880,
  margin: 'auto',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const auth = getAuth(fireBaseInit);

export default function ChangePassword() {
  const navigate = useNavigate();

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
  } = methods;

  const [authSucces, setAuthSucces] = useState(false);

  const handleOldPasswordCheck = async (evt) => {
    const oldPasswordFromForm = getValues('oldPassword');
    const oldPassword = evt.target.value;
    console.log({ oldPasswordFromForm, oldPassword });
    try {
      const user = auth.currentUser;
      const userEmail =localStorage.getItem('userEmail');

      const credential = EmailAuthProvider.credential(auth.currentUser.email || userEmail, oldPassword);
      const result = await reauthenticateWithCredential(user, credential);

      setAuthSucces(true);

      console.log("Password authenticated successfully");
    } catch (error) {
      console.error('failed reauth during change password');
      setAuthSucces(false);
    }
  };

  const onSubmit = async (data) => {
    console.log({ data });
     
    if (authSucces && data.newPassword1 === data.newPassword2) {

      try {
        const user = auth.currentUser;
        await updatePassword(user, data.newPassword1);
        console.log("Password updated successfully");
      } catch (error) {
        console.error('failed update password');
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
                    <RHFTextField name="oldPassword" type="password" label="Old password" onBlur={handleOldPasswordCheck} />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField name="newPassword1" type="password" label="New password" />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField name="newPassword2" label="Re-enter password" />
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
    </Page>
  );
}
