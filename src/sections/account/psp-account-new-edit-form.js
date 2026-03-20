import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

// components
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { alpha } from '@mui/system';
import Iconify from 'src/components/iconify';

import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

export default function PspAccount({onclose,pspDetails}) {

    const PSP_OPTIONS = [
        { value: 'razorpay', label: 'Razorpay' },
        { value: 'paytm', label: 'Paytm' },
        { value: 'phonepe', label: 'PhonePe' },
        { value: 'cashfree', label: 'Cashfree' },
        { value: 'stripe', label: 'Stripe' },
        { value: 'ccavenue', label: 'CCAvenue' },
        { value: 'payu', label: 'PayU' },
    ];

    const isEdit = true; // temporary flag

    const UpdateUserSchema = Yup.object().shape({
        psp: Yup.string().required('PSP is required'),
        merchantId: Yup.string().required('Merchant ID is required'),
        settlementAccount: Yup.string().required('Settlement account is required'),
        apiKey: Yup.string().required('API key is required'),
        apiSecret: Yup.string().required('API secret is required'),
        WebhookUrl: Yup.string().url('Enter valid URL').required('Webhook URL required'),
    });

    const defaultValues = {
        psp: '',
        merchantId: '',
        settlementAccount: '',
        apiKey: '',
        apiSecret: '',
        WebhookUrl: '',
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        console.log('PSP Form Data:', data);
    };

    return (
        <Container>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <Stack pt={2} pb={2}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Add New PSP Integration
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 200 }}>
                            Configure your payment service provider integration. Your request will be reviewed and approved by our team.
                        </Typography>
                    </Stack>
                    <Box>
                        <Box sx={{ width: 200, mb: 3 }}>
                            <RHFSelect name="psp" label="Select PSP" disabled={!isEdit}>
                                {PSP_OPTIONS.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Box>

                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField
                                name="merchantId"
                                label="Merchant ID"
                                disabled={!isEdit}
                                placeholder="Enter Merchant ID"
                            />

                            <RHFTextField
                                name="settlementAccount"
                                label="Settlement Account"
                                disabled={!isEdit}
                                placeholder="Enter Bank Account Number"
                            />
                        </Box>

                        <Box mt={3}>
                            <RHFTextField
                                name="apiKey"
                                label="API Key"
                                disabled={!isEdit}
                                placeholder="Enter API Key"
                            />
                        </Box>

                        <Box mt={3}>
                            <RHFTextField
                                name="apiSecret"
                                label="API Secret"
                                disabled={!isEdit}
                                placeholder="Enter API Secret"
                            />
                        </Box>

                        <Box mt={3}>
                            <RHFTextField
                                name="WebhookUrl"
                                label="Webhook URL"
                                disabled={!isEdit}
                                placeholder="Enter webhook URL"
                            />
                        </Box>
                        <Typography variant='caption'>This URL will be automatically configured. Please whitelist this in your PSP dashboard.</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            alignContent: "center",
                            gap: 2,
                            p: 1,
                            borderRadius: 1,
                            border: (theme) => `solid 2px ${alpha(theme.palette.warning.main, 1.00)}`,
                            backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.10),
                            color: (theme) => alpha(theme.palette.warning.main, 1.00),

                            mb: 1
                        }}

                    > <Box display="flex" >
                            <Stack p={2} pt={0.5}>
                                <Iconify icon="si:info-duotone"
                                    width={20} sx={{ color: (theme) => alpha(theme.palette.warning.main, 1.00), mt: 0 }} />
                            </Stack>
                            <Box>
                                <Box display="flex" justifyContent='flex-start'>
                                    <Typography variant="h7" sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        Review Process
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent='flex-start'>

                                    <Typography variant='body2' >Your integration request will be reviewed by our operations team within 24 hours. You will be notified once approved.</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mb={2} >
                        <Button color='primary' variant="outlined"> Cancel</Button>
                        <LoadingButton type="submit" color='primary' variant="contained" loading={isSubmitting} sx={{ml:2}} >
                            Save For Review
                        </LoadingButton>
                    </Box>

                </Stack>
            </FormProvider>

        </Container>
    );
}

PspAccount.propTypes = {
  onclose: PropTypes.func,
  pspDetails:PropTypes.object,
  // isEdit: PropTypes.func
}