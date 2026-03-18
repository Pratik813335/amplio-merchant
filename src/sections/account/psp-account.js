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
    pspName: "Paytm",
    merchantId: "paytm_M_12345",
    status: 0,
    createdAt: "2026-03-04",
    requestedBy: "john@acmecorp.com",
  },
  {
    id: 2,
    pspName: "CCAvenue",
    merchantId: "ccav_98765",
    status: 2,
    createdAt: "2026-02-28",
    deletedAt: "2026-03-02",
    rejectionReason: "Invalid merchant credentials. Please verify your Merchant ID and API Key.",
  },
  {
    id: 3,
    pspName: "Razorpay",
    merchantId: "rzp_M_65432",
    status: 1,
    createdAt: "2026-02-20",
    requestedBy: "admin@company.com",
  },
];

export default function PspAccountPage() {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsedit] = useState(false);

  const close = () => {
    setOpen(false);
  };

  const { PspDetails, refreshDetails } = useGetPspDetails();

  const [pspData, setPspData] = useState();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const navigate = useNavigate();

  const handleViewRow =
    (id, status) => {
      if (status === 0 || status === 1) {
        const data = pspData.filter((item) => item.id === id)
        setPspData(data);
        setIsedit(true);
        setOpen(true);
      }
      const data = pspData.filter((item) => item.id === id)
      setPspData(data);
      setOpen(true);
    }


  // useEffect(() => {
  //   fetchBankDetails();
  // }, [open]);

  useEffect(() => {
    // if (PspDetails) {
    //   setPspData(PspDetails);
    //   setLoading(false);
    // }
    setPspData(PSP_DUMMY_DATA);
    setLoading(false);
  }, [PspDetails]);

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
      {/* Header + Button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Payment Service Provider Integrations
          </Typography>
          <Typography variant="subtitle1" sx={{ color: (theme) => theme.palette.grey[700] }}>
            Connect your PSP accounts for real-time receivables tracking
          </Typography>
        </Box>

        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          + Create PSP Account
        </Button>
      </Stack>

      <Dialog open={open} onClose={close} maxWidth={10}>
        <DialogContent>
          <PspAccount
            // refreshBankDetail={refreshDetails}
            isEdit={isEdit}
            pspDetails={pspData}
            onclose={close}
          />
        </DialogContent>
      </Dialog>

      {/* If no bank exists → Show message */}
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