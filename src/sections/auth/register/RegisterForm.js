import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';

import 'yup-phone';
import 'react-phone-input-2/lib/material.css';

import { addDoc, collection, getFirestore, updateDoc } from 'firebase/firestore';
import fireBaseInit from '../../../utils/firebase-init';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const db = getFirestore(fireBaseInit);
const auth = getAuth(fireBaseInit);

// ----------------------------------------------------------------------


export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    phone: Yup.string().phone().required('Phone number is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
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
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        // console.log({ user: userCredential.user });

        const usersTable = collection(db, 'users');
        const snapshot = await addDoc(usersTable, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email
        })
        console.log(snapshot.docs[0].data())

        console.log('database')

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>
        {/* <RHFTextField name="phone" type="tel" label="Phone number" /> */}
        <PhoneInputField name="phone" type="tel" label="Phone number" />
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

export function PhoneInputField({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, isTouched } }) => (
        <>
          <PhoneInput
            onlyCountries={['us']}
            country="us"
            disableCountryCode
            disableDropdown
            prefix="+"
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            {...field}
            searchStyle={{
              borderColor: isTouched && error && 'red',
              backgroundColor: 'transparent',
            }}
            inputStyle={{
              borderColor: isTouched && error && 'red',
              backgroundColor: 'transparent',
            }}
          />
        </>
      )}
    />
  );
}
