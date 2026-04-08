import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const DISCLAIMER_SECTIONS = [
  {
    title: 'Privacy Notice - BirbalPlus',
    body:
      'BirbalPlus collects, uses, processes, and stores your personal and business data to provide onboarding, verification, and financial services in compliance with applicable law.',
  },
  {
    title: 'Data We Collect',
    body:
      'We may collect identity information (such as Aadhaar and PAN), contact details (mobile number and email), bank account details, business information (including CIN, GST, and company details), documents, and details of Ultimate Beneficial Owners (UBOs).',
  },
  {
    title: 'Purpose of Use',
    body:
      'Your data is used for identity verification (KYC), account creation, bank account verification (including penny drop), business verification (including CIN-based data retrieval), fraud prevention, transaction processing, and regulatory compliance.',
  },
  {
    title: 'Third-Party Processing',
    body:
      'Your data may be processed using authorized third-party service providers, including identity verification systems (such as UIDAI and DigiLocker), banking and payment partners, government or regulatory sources (such as MCA and GST systems), and data providers. Such processing is limited to the purposes described above.',
  },
  {
    title: 'Storage and Retention',
    body:
      'Your data, including sensitive personal and financial information, may be securely stored in our systems and retained for as long as required for service delivery, fraud prevention, and compliance with legal and regulatory obligations.',
  },
  {
    title: 'Contact Information',
    body:
      'Your mobile number and email address are used to send OTPs, transaction alerts, and important account-related communications. These are not used for marketing without your separate consent.',
  },
  {
    title: 'Your Rights',
    body:
      'You have the right to access, correct, or delete your personal data, withdraw your consent, and nominate another individual to exercise your rights, subject to applicable law.',
  },
  {
    title: 'Withdrawal of Consent',
    body:
      'You may withdraw your consent at any time. Withdrawal of certain required consents may result in discontinuation of services. Data retained for legal or regulatory purposes will continue to be retained as required.',
  },
  {
    title: 'Contact',
    body:
      'For any questions or complaints, you may contact our Grievance Officer at: Email: [Insert Email]',
  },
];

export default function JwtRegistrationDisclaimerDialog({ open, onClose, onContinue }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Privacy Notice</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Please review this notice before continuing to account registration.
        </Typography>

        <Stack
          spacing={2}
          sx={{
            p: 3,
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.neutral',
          }}
        >
          {DISCLAIMER_SECTIONS.map((section) => (
            <Box key={section.title}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="inherit" onClick={onContinue}>
          I agree and continue
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
