import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { useRouter } from 'src/routes/hook';

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
import { useGetBankDetails } from 'src/api/bank-details';

import { paths } from 'src/routes/paths';
import BankDetailsCard from './bank-cards';
import BankNewForm from './bank-account-new-edit-form';

export default function BusinessBankPage() {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  const { BankDetails, refreshDetails } = useGetBankDetails();

    console.log("dataaaa", BankDetails)

  const [bankData, setBankData] = useState();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const navigate = useNavigate();

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.bankDetails.details(id));
    },
    [router]
  );

  // useEffect(() => {
  //   fetchBankDetails();
  // }, [open]);

  useEffect(() => {
    if (BankDetails) {
      setBankData(BankDetails);
      setLoading(false);
    }
  }, [BankDetails]);

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
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Company Bank Details
        </Typography>

        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          + Create Bank Details
        </Button>
      </Stack>

      <Dialog open={open} onClose={close} maxWidth={10}>
        <DialogContent>
          <BankNewForm
            refreshBankDetail={refreshDetails}
            bankDetails={bankData}
            onclose={close}
          />
        </DialogContent>
      </Dialog>

      {/* If no bank exists → Show message */}
      {bankData.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No bank details added yet. Click Create Bank Details to continue.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bankData?.map((item) => (
            <Grid key={item.id} item xs={12} md={6}>
              <BankDetailsCard bank={item} onViewRow={() => handleViewRow(item.id)} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}