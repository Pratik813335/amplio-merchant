import { useState } from 'react';
import { Box, Stack } from '@mui/material';

import { AnimatePresence, m } from 'framer-motion';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
// import KYCUBOs from './kyc-ubo-list';
import UbosListView from './view/kyc-ubo-list-view';
import KYCMerchantDetails from './kyc-merchant-details';
import KYCBankDetails from './kyc-bank-details';
import KYCAddressDetails from './kyc-address-details';
import { PSPListView } from './psp/view';

export default function Stepper() {
  const router = useRouter();
  const steps = [
    { id: 'kyc_merchant_documents', number: 1, lines: ['Merchant', 'Documents'] },
    { id: 'kyc_address_details', number: 2, lines: ['Address', 'Details'] },
    { id: 'kyc_bank_details', number: 3, lines: ['Bank', 'Details'] },
    { id: 'kyc_ubo_details', number: 4, lines: ['UBO', 'Details'] },
    { id: 'kyc_psp', number: 5, lines: ['PSP', 'Details'] },
  ];

  const [activeStepId, setActiveStepId] = useState('kyc_merchant_documents');
  const [dataInitializedSteps, setDataInitializedSteps] = useState([]);
  const [stepsProgress, setStepsProgress] = useState({
    kyc_merchant_documents: { percent: 0 },
    kyc_address_details: { percent: 0 },
    kyc_bank_details: { percent: 0 },
    kyc_ubo_details: { percent: 0 },
    kyc_psp: { percent: 0 },
  });

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const handleStepClick = (stepId) => {
    const index = steps.findIndex((s) => s.id === stepId);

    // Prevent skipping ahead
    for (let i = 0; i < index; i += 1) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const renderForm = () => {
    switch (activeStepId) {
      case 'kyc_merchant_documents':
        return (
          <KYCMerchantDetails
            percent={(p) => updateStepPercent('kyc_merchant_documents', p)}
            setActiveStepId={() => setActiveStepId('kyc_address_details')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_merchant_documents'])
            }
          />
        );

      case 'kyc_address_details':
        return (
          <KYCAddressDetails
            percent={(p) => updateStepPercent('kyc_address_details', p)}
            setActiveStepId={() => setActiveStepId('kyc_bank_details')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_address_details'])
            }
          />
        );

      case 'kyc_bank_details':
        return (
          <KYCBankDetails
            percent={(p) => updateStepPercent('kyc_bank_details', p)}
            setActiveStepId={() => setActiveStepId('kyc_ubo_details')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_bank_details'])
            }
          />
        );

      case 'kyc_ubo_details':
        return (
          <UbosListView
            percent={(p) => updateStepPercent('kyc_ubo_details', p)}
            setActiveStepId={() => setActiveStepId('kyc_psp')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_ubo_details'])
            }
          />
        );

      case 'kyc_psp':
        return (
          <PSPListView
            percent={(p) => updateStepPercent('kyc_psp', p)}
            setActiveStepId={() => router.push(paths.auth.kyc.kycPending)}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() => setDataInitializedSteps((prev) => [...prev, 'kyc_psp'])}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        <Logo />
      </Box>

      <ProgressStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>
        <AnimatePresence mode="wait">
          <m.div
            key={activeStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderForm()}
          </m.div>
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
