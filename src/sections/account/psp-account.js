import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'src/routes/hook';
import { useGetPspDetails } from 'src/api/psp-details';

import {
  CircularProgress,
  Box,
  Button,
  Stack,
  Typography,
  Grid,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


import { paths } from 'src/routes/paths';
// import BankDetailsCard from './bank-cards';
// import BankNewForm from './bank-account-new-edit-form';
// import PspDetailsCard from './psp-account-card';
import PspAccount from './psp-account-new-edit-form';
import PspDetailsCard from './psp-account-card';


export const PSP_DUMMY_DATA = [
  {
    id: 1,
    pspName: "paytm",
    merchantId: "paytm_M_12345",
    settlementAccount: "987654321012",
    apiKey: "paytm_test_api_key_123",
    apiSecret: "paytm_test_secret_456",
    WebhookUrl: "https://example.com/webhook/paytm",
    status: 0,
    createdAt: "2026-03-04",
    requestedBy: "john@acmecorp.com"
  },
  {
    id: 2,
    pspName: "pazorpay",
    merchantId: "rzp_M_56789",
    settlementAccount: "123456789012",
    apiKey: "rzp_test_api_key_789",
    apiSecret: "rzp_test_secret_321",
    WebhookUrl: "https://example.com/webhook/razorpay",
    status: 1,
    createdAt: "2026-03-01",
    requestedBy: "admin@acmecorp.com"
  },
  {
    id: 3,
    pspName: "phonepe",
    merchantId: "phonepe_M_33445",
    settlementAccount: "456789123456",
    apiKey: "phonepe_test_api_key",
    apiSecret: "phonepe_secret_key",
    WebhookUrl: "https://example.com/webhook/phonepe",
    status: 2,
    createdAt: "2026-02-26",
    deletedAt:"2026-02-28",
    requestedBy: "ops@acmecorp.com"
  }
];

export default function PspAccountPage() {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsedit] = useState(false);

  const close = () => {
    setOpen(false);
    setIsedit(false);
  };

  const { PspDetails, refreshDetails } = useGetPspDetails();

  const [pspData, setPspData] = useState();
  const [selectedpspData, setSelectedPspData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const navigate = useNavigate();

  const handleViewRow =
    (id, status) => {
       const data = pspData.find((item) => item.id === id)
       setSelectedPspData(data);

      if (status === 0 || status === 1) {
        setIsedit(true);
        setOpen(true);
        return;
      }
       console.log(data);
      setOpen(true);
    }

  useEffect(() => {
    // if (PspDetails) {
    //   setPspData(PspDetails);
    //   setLoading(false);
    // }
    setPspData(PSP_DUMMY_DATA);
    setLoading(false);
  }, [PspDetails]);


  // useEffect(() => {
  //   fetchBankDetails();
  // }, [open]);

  // const fetchBankDetails = async () => {
  //   try {
  //     const res = await axiosInstance.get(`/company-profiles/bank-details`);
  //     setBankData(res?.data?.bankDetails || null);
  //   } catch {
  //     setBankData(null);
  //   }
  //   setLoading(false);
  // };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            Payment Service Provider Integrations
          </Typography>
          <Typography variant="subtitle1" sx={{ color: (theme) => theme.palette.grey[700] }}>
            Connect your PSP accounts for real-time receivables tracking
          </Typography>
        </Box>

        <Button variant="contained" color="primary" onClick={() => { setIsedit(true); setSelectedPspData(null); setOpen(true);}}>
          + Create PSP Account
        </Button>
      </Stack>

      <Dialog open={open} onClose={close} >
        <DialogContent>
          <PspAccount
            refreshBankDetail={refreshDetails}
            isEdit={isEdit}
            pspDetails={selectedpspData}
            onclose={close}
          />
        </DialogContent>
      </Dialog>
      {pspData.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No PSP added yet. Click Create PSP Account to continue.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {pspData?.map((item) => (
            <Grid key={item.id} item xs={12} md={6}>
              <PspDetailsCard
                psp={item} onViewRow={() => handleViewRow(item.id, item.status)} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}