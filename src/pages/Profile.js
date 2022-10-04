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
import { collection, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
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

const db = getFirestore(fireBaseInit);

export default function Profile() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    phone: Yup.string().phone().required('Phone number is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const onSubmit = async (data) => {
    console.log({ data });

    const userEmail = localStorage.getItem('userEmail');
    const usersTable = collection(db, 'users');

    const snapshot = await query(usersTable, where('email', '==', userEmail));
    const result = await getDocs(snapshot);

    console.log('result', result.docs[0].ref);
    await setDoc(result.docs[0].ref, data);

    console.log('success !');
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const usersTable = collection(db, 'users');
    // const snapshot = await getDocs(usersTable);
    const update = async () => {
      const snapshot = await query(usersTable, where('email', '==', userEmail));
      const result = await getDocs(snapshot);
      console.log(result.docs[0].data());
      const { firstName, lastName, phone, email } = result.docs[0].data();
      firstName && setValue('firstName', firstName);
      lastName && setValue('lastName', lastName);
      phone && setValue('phone', phone);
      email && setValue('email', email);
    };
    update();
  }, []);

  return (
    <Page title="Profile">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
        </Stack>

        <Card>
          <Container>
            <ContentStyle>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <RHFTextField name="firstName" label="First name" />
                  </Grid>
                  <Grid item xs={6}>
                    <RHFTextField name="lastName" label="Last name" />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField name="phone" label="Phone number" />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField name="email" label="Email address" disabled />
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
