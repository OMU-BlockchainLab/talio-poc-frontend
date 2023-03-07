import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { GET_LIST_ROLES, SIGN_UP_USER_GQL } from 'service/auth';
import { useMutation, useQuery } from 'urql';
import * as yup from 'yup';
interface DataForm {
  fullName: string;
  email: string;
  password: string;
}

let schema = yup.object().shape({
  fullName: yup.string().required('Required'),
  email: yup.string().email('Email invalid!').required('Required'),
  password: yup.string().required('Required'),
});

export interface ISignUpProps {}

export default function SignUp(props: ISignUpProps) {
  const [role, setRole] = useState<string>('');
  const [{}, signUpUser] = useMutation(SIGN_UP_USER_GQL);
  const [roles, getListRoles] = useQuery({
    query: GET_LIST_ROLES,
    requestPolicy: 'network-only',
  });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getListRoles();
  }, [getListRoles]);
  console.log(roles);

  useEffect(() => {
    if (roles?.data?.roles) {
      setRole(roles.data.roles?.rows[0]?.id);
    }
  }, [roles]);
  console.log('dataform', role);
  const onSubmit: SubmitHandler<DataForm> = async (data) => {
    const dataForm = { ...data, roleId: role };
    console.log('dataform', role);
    try {
      const res = await signUpUser(dataForm);
      console.log(res);
      if (res.data?.signUp && !res.error) {
        navigate('/sign-in');
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleChangeSelectRole = (e: any) => {
    setRole(e.target.value);
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
              Register Account
            </Typography>
            <Box sx={{ width: 531, maxWidth: '100%' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3.5}>
                  <Stack spacing={1}>
                    <TextField
                      {...register('fullName')}
                      fullWidth
                      name="fullName"
                      label="Full name"
                      error={!!errors.fullName}
                      type="text"
                    />
                    {errors.fullName && (
                      <Typography variant="body1" sx={{ color: 'red' }} align="left">
                        {errors.fullName?.message}
                      </Typography>
                    )}
                  </Stack>
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
                    <FormControl fullWidth>
                      <TextField
                        type="password"
                        {...register('password')}
                        fullWidth
                        label="Password"
                        error={!!errors.password}
                        name="password"
                        autoComplete="true"
                      />
                    </FormControl>
                    {errors.password && (
                      <Typography sx={{ color: 'red' }} align="left">
                        {errors.password.message}
                      </Typography>
                    )}
                  </Stack>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">Roles</InputLabel>
                    <Select
                      value={role}
                      label="Role"
                      sx={{
                        textAlign: 'left',
                      }}
                      onChange={handleChangeSelectRole}
                    >
                      {roles.data?.roles?.rows?.map((role: any) => (
                        <MenuItem key={Math.random()} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                      Register
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
