import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

import { collection, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';

// components
import fireBaseInit from '../../../utils/firebase-init';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const auth = getAuth(fireBaseInit);
const db = getFirestore(fireBaseInit);

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
    otp: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    getValues,
    clearErrors,
  } = methods;

  const [loginSuccess, setLoginSuccess] = useState(false);

  const onSubmit = async (data) => {
    // console.log(data);
    if (!loginSuccess) {
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredential) => {
          
          // Signed in
          const usersTable = collection(db, 'users');
          // const snapshot = await getDocs(usersTable);
          const snapshot = await query(usersTable, where('email', '==', userCredential.user.email));
          const result = await getDocs(snapshot);
          
          localStorage.setItem('userEmail', userCredential.user.email);
          localStorage.setItem('userPhone', result.docs[0].data().phone);
        
          handleSendOtp(result.docs[0]?.data()?.phone);
        })
        .catch((error) => {
          console.log({ error: error.message });
          setLoginSuccess(false);
          if(error.message !== "INVALID_PASSWORD"){
            setError('email', { type: 'custom', message: 'email does not exist' });
          } else {
            setError('password', { type: 'custom', message: 'password is invalid' });
          }
        });
    } else if (!getValues('otp')) {
      setError('otp', { type: 'custom', message: 'OTP is required' });
    } else {
      clearErrors('otp');

      window.confirmationResult.confirm(getValues('otp')).then((result) => {

        navigate('/dashboard/search', { replace: true });

      }).catch((error)=>{

        console.log({error});
        if(error.code?.includes("auth/invalid-verification-code")){
          setError('otp', { type: 'custom', message: 'Invalid OTP provided' });
        }
      });
    }
  };

  const handleSendOtp = (userPhone) => {
    if (!userPhone) {
      alert('Enter the number please');
    } else {
      const appVerifier = window.recaptchaVerifier;
      const phoneValue = `+1${userPhone}`;
      signInWithPhoneNumber(auth, phoneValue, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          console.log({ confirmationResult });
          setLoginSuccess(true);

        })
        .catch((error) => console.log(error));
    }
  };
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // console.log('response>>>', response);
        },
      },
      auth
    );
  }, []);

  console.log({ isSubmitting })
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          id="sign-in-button"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {loginSuccess && <RHFTextField name="otp" label="Enter OTP" />}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <RHFCheckbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" component={RouterLink} to="/forgotpassword">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        {loginSuccess ? 'Login with OTP' : 'Login'}
      </LoadingButton>
    </FormProvider>
  );
}
