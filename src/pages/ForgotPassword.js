import { filter } from 'lodash';
import * as Yup from 'yup';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Card, Table, Stack, Avatar, Button, Container, Typography, InputAdornment, styled, Grid } from '@mui/material';
// components
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { Box } from '@mui/system';
import { FormProvider, RHFTextField } from '../components/hook-form';
import Page from '../components/Page';

import fireBaseInit from '../utils/firebase-init';
import { HeaderStyle, RootStyle, SectionStyle } from './Register';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/Logo';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const auth = getAuth(fireBaseInit);

export default function ForgotPassword() {
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log({ data });

    try {
      await sendPasswordResetEmail(auth, data.email);

      console.log('Reset email sent successfully');
    } catch (error) {
      console.error('Failed to send email reset link');
    }
    // }
  };

  useEffect(() => {}, []);
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Forgotpassword">
      <RootStyle>
        <HeaderStyle>
          {/* <Logo /> */}
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Already have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/login">
                Login
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Create your account today !
            </Typography>
            <Box sx={{
              width: "400px",
              marginRight: 'auto',
              marginLeft: 'auto',
            }}>
            <img alt="register" src="/static/illustrations/forgt-password.png" />
            </Box>
          </SectionStyle>
        )}
        <ContentStyle>
          <Container sx={{ my: 10 }} maxWidth="sm">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                Change Password
              </Typography>
            </Stack>

            {/* <Card> */}
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <RHFTextField name="email" label="Send email to" autoFocus />
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Save
                  </LoadingButton>
                </Grid>
              </Grid>
            </FormProvider>
            {/* </Card> */}
          </Container>
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
