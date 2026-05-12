import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { useGetConsentDetails } from 'src/api/consent-details';

// ----------------------------------------------------------------------

export default function JwtRegistrationDisclaimerDialog({
  open,
  onClose,
  onContinue,
}) {
  const [submitting, setSubmitting] = useState(false);

  const { consentDetails, consentDetailsLoading } =
    useGetConsentDetails('privacy-notice-merchant');

  const handleAgree = async () => {
    try {
      setSubmitting(true);

      await axiosInstance.post('/user-consents', {
        consentTemplateId: consentDetails?.id,
        isChecked: true,
      });

      onContinue();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {consentDetails?.title || 'Privacy Notice'}
      </DialogTitle>

      <DialogContent dividers>
        <Typography
          variant="body2"
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Please review this notice before continuing to account registration.
        </Typography>

        <Stack
          spacing={2}
          sx={{
            p: 3,
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.neutral',
            minHeight: 200,
            justifyContent: consentDetailsLoading
              ? 'center'
              : 'flex-start',
            alignItems: consentDetailsLoading
              ? 'center'
              : 'stretch',
          }}
        >
          {consentDetailsLoading ? (
            <CircularProgress />
          ) : (
            <Box
              sx={{
                '& h2': {
                  fontSize: 20,
                  fontWeight: 700,
                  mb: 1,
                  mt: 3,
                },
                '& p': {
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: 2,
                },
              }}
              dangerouslySetInnerHTML={{
                __html: consentDetails?.content || '',
              }}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="inherit"
          onClick={handleAgree}
          disabled={consentDetailsLoading || submitting}
        >
          {submitting ? 'Submitting...' : 'I agree and continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

JwtRegistrationDisclaimerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};
