import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GET_PROFILE, LOGIN_USER_GQL } from 'service/auth';
import { useMutation, useQuery } from 'urql';
import * as yup from 'yup';

let schema = yup.object().shape({
  email: yup.string().email('Email invalid!').required('Required'),
  password: yup.string().required('Required'),
});

export interface ISignInProps {}

interface DataForm {
  email: string;
  password: string;
}

export default function SignIn(props: ISignInProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
  });
  const [isLogin, setIsLogin] = useState(false);
  const [{ data, error, fetching }, getProfile] = useQuery({ query: GET_PROFILE });
  const [{}, signIn] = useMutation(LOGIN_USER_GQL);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<DataForm> = async (data) => {
    try {
      const res = await signIn(data);
      console.log(res);
      if (res.data?.signInByEmail) {
        localStorage.setItem('token', res.data?.signInByEmail?.accessToken);
        navigate('/');
      } else {
        alert(res.error?.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Box sx={{ p: 2 }}>
      <Grid
        container
        rowSpacing={13}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* Create form sign up */}
        <Grid item container justifyContent="center" alignItems="center">
          <Stack
            sx={{
              background:
                'radial-gradient(190.02% 182.58% at -1.88% 14.39%, #FFFFFF 32.1%, rgba(255, 255, 255, 0) 88.91%)',
              p: 7.5,
              position: 'relative',
              borderRadius: '1.5rem',
            }}
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <Typography variant="subtitle1" sx={{ fontSize: '3.5rem', fontWeight: 'bold' }}>
              Sign In
            </Typography>
            <Box sx={{ width: 531, maxWidth: '100%' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3.5}>
                  <Stack spacing={1}>
                    <TextField
                      {...register('email')}
                      fullWidth
                      name="email"
                      label="Email"
                      error={!!errors.email}
                      type="text"
                    />
                    {errors.email && (
                      <Typography variant="body1" sx={{ color: 'red' }} align="left">
                        {errors.email?.message}
                      </Typography>
                    )}
                  </Stack>
                  <Stack spacing={1}>
                    <TextField
                      type="password"
                      {...register('password')}
                      fullWidth
                      label="Password"
                      error={!!errors.password}
                      name="password"
                      autoComplete="true"
                    />
                    {errors.password && (
                      <Typography sx={{ color: 'red' }} align="left">
                        {errors.password.message}
                      </Typography>
                    )}
                  </Stack>
                  <Stack spacing={1} direction="column" justifyContent="center" alignItems="center">
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        color: 'info.contrastText',
                        backgroundColor: 'primary.dark',
                        width: 150,
                        px: 4,
                        py: 1.5,
                        borderRadius: '1.5rem',
                        textTransform: 'none',
                        fontSize: '2rem',
                      }}
                    >
                      Login
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
            <Link to="/sign-up">You't have account?</Link>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
