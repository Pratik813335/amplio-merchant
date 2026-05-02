const REQUIRED_KYC_PROGRESS = [
  'merchant_kyc',
  'merchant_documents',
  'merchant_address_details',
  'merchant_bank_details',
  'merchant_ubo_details',
  'merchant_psp_details',
];

const PENDING_APPROVAL_PROGRESS = [
  'merchant_approval_pending',
  'super_admin_approval_pending',
  'merchant_pending_approval',
];

const APPROVED_PROGRESS = ['merchant_approved', 'merchant_kyc_approved'];

export const MERCHANT_KYC_APPLICATION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

export function hasCompletedMerchantKyc(progress = []) {
  return REQUIRED_KYC_PROGRESS.every((step) => progress.includes(step));
}

export function getMerchantOnboardingState(kycProgress) {
  const progress = kycProgress?.currentProgress || [];
  const applicationStatus = kycProgress?.profile?.kycApplications?.status;
  const isBusinessKycComplete = kycProgress?.profile?.isBusinessKycComplete;
  const isKycComplete = hasCompletedMerchantKyc(progress);

  if (
    progress.some((step) => APPROVED_PROGRESS.includes(step)) ||
    isBusinessKycComplete === true ||
    applicationStatus === MERCHANT_KYC_APPLICATION_STATUS.APPROVED
  ) {
    return 'approved';
  }

  if (
    progress.some((step) => PENDING_APPROVAL_PROGRESS.includes(step)) ||
    (isKycComplete && applicationStatus === MERCHANT_KYC_APPLICATION_STATUS.PENDING)
  ) {
    return 'pending_approval';
  }

  if (!progress.includes('merchant_kyc')) {
    return 'basic_info';
  }

  return 'in_progress';
}
