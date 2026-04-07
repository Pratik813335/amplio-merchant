import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// routes
import { paths } from 'src/routes/paths';
import { useSearchParams, useRouter } from 'src/routes/hook';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { Card } from '@mui/material';
import disclaimerPdf from 'src/assets/documents/merchant-registration-disclaimer.pdf';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    rememberMe: Yup.boolean(),
  });

  const defaultValues = {
    email: '',
    password: '',
    rememberMe: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password, data.rememberMe);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);

      const message =
        typeof error === 'string'
          ? error
          : error?.error?.message || error?.message || 'Login failed';

      if (message.toLowerCase().includes('email')) {
        setErrorMsg('Email address not found');
      } else if (message.toLowerCase().includes('password')) {
        setErrorMsg('Incorrect password');
      } else {
        setErrorMsg(message);
      }
    }
  });

  const handleOpenDisclaimer = () => {
    setIsDisclaimerOpen(true);
  };

  const handleCloseDisclaimer = () => {
    setIsDisclaimerOpen(false);
  };

  const handleContinueToRegister = () => {
    setIsDisclaimerOpen(false);
    router.push(paths.auth.jwt.registerPhone);
  };

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'start' }}>
        Sign in To Merchant Portal
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'start' }}>
        Log in securely to manage your account, protect your personal information, and stay safe
        with advanced security features
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component="button" type="button" variant="subtitle2" onClick={handleOpenDisclaimer}>
          Create an account
        </Link>
      </Stack>
      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <RHFCheckbox name="rememberMe" label="Remember me" sx={{ m: 0 }} />
        <Link
          variant="body2"
          color="inherit"
          underline="always"
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() => router.push(paths.auth.jwt.forgotPassword)}
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Copyright © 2025 InvoiceDiscounting. All rights reserved.
      </Typography>
    </Stack>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3, py: 5 }}>{renderForm}</Card>
      </FormProvider>

      <Dialog open={isDisclaimerOpen} onClose={handleCloseDisclaimer} fullWidth maxWidth="md">
        <DialogTitle>Registration Disclaimer</DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Please review this disclaimer before continuing to account registration.
          </Typography>

          <Card variant="outlined" sx={{ overflow: 'hidden' }}>
            <iframe
              title="Registration Disclaimer PDF"
              src={disclaimerPdf}
              width="100%"
              height="520"
              style={{ border: 0, display: 'block' }}
            />
          </Card>

          <Link
            href={disclaimerPdf}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ display: 'inline-flex', mt: 2 }}
          >
            Open disclaimer in a new tab
          </Link>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDisclaimer}>Cancel</Button>
          <Button variant="contained" color="inherit" onClick={handleContinueToRegister}>
            I agree and continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
