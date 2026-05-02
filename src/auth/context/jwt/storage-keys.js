export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
export const ONBOARDING_TOKEN_STORAGE_KEY = 'onboardingAccessToken';

export function getStoredAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getStoredOnboardingToken() {
  return sessionStorage.getItem(ONBOARDING_TOKEN_STORAGE_KEY);
}

export function getActiveAuthToken() {
  return getStoredAccessToken() || getStoredOnboardingToken();
}

export function clearMerchantOnboardingStorage() {
  sessionStorage.removeItem(ONBOARDING_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem('merchant_user_id');
  sessionStorage.removeItem('merchant_profile_id');

  Object.keys(sessionStorage)
    .filter((key) => key.startsWith('kyc_ubo_next_confirmed:'))
    .forEach((key) => sessionStorage.removeItem(key));

  localStorage.removeItem('sessionId');
}
