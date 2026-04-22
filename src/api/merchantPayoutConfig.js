import useSWR from 'swr';
import { useCallback, useMemo } from 'react';

import axiosInstance, { endpoints } from 'src/utils/axios';

/**
 * @typedef {'eod' | 'bucketed'} MerchantPayoutScheduleMode
 * @typedef {'active' | 'stop_requested' | 'stopped'} MerchantAutoPayoutStatus
 *
 * @typedef {Object} MerchantPayoutConfig
 * @property {string} [id]
 * @property {number} [maxAllowedDailyCap]
 * @property {number} [selectedDailyCap]
 * @property {MerchantPayoutScheduleMode} [scheduleMode]
 * @property {number} [frequencyHours]
 * @property {string} [startTime]
 * @property {string} [cutoffTime]
 * @property {string} [timezone]
 * @property {boolean} [autoPayoutEnabled]
 * @property {MerchantAutoPayoutStatus} [autoPayoutStatus]
 * @property {string} [commitmentUnit]
 * @property {number} [commitmentValue]
 * @property {string} [commitmentStartAt]
 * @property {string} [commitmentEndAt]
 * @property {string | null} [stopRequestedAt]
 * @property {string | null} [stopEffectiveAt]
 * @property {string | null} [stopReason]
 * @property {number} [effectiveDailyCap]
 * @property {string | null} [resolvedCommitmentEndAt]
 * @property {boolean} [canStopAutoPayout]
 * @property {boolean} [hasPrimaryBankAccount]
 *
 * @typedef {Object} MerchantPayoutConfigResponse
 * @property {boolean} success
 * @property {string} [message]
 * @property {string} [merchantProfileId]
 * @property {MerchantPayoutConfig | null} [config]
 *
 * @typedef {Object} UpsertMerchantPayoutConfigPayload
 * @property {number} selectedDailyCap
 * @property {MerchantPayoutScheduleMode} scheduleMode
 * @property {number} [frequencyHours]
 * @property {number} [maxAllowedDailyCap]
 *
 * @typedef {Object} StopMerchantAutoPayoutPayload
 * @property {string} [stopReason]
 */

export async function getMerchantPayoutConfig() {
  const response = await axiosInstance.get(endpoints.merchantPayoutConfig.me);

  return response.data;
}

export async function upsertMerchantPayoutConfig(payload) {
  const response = await axiosInstance.post(endpoints.merchantPayoutConfig.me, payload);

  return response.data;
}

export async function stopMerchantAutoPayout(payload) {
  const response = await axiosInstance.post(endpoints.merchantPayoutConfig.stop, payload || {});

  return response.data;
}

export async function reactivateMerchantAutoPayout() {
  const response = await axiosInstance.post(endpoints.merchantPayoutConfig.reactivate);

  return response.data;
}

export function useGetMerchantPayoutConfig() {
  const URL = endpoints.merchantPayoutConfig.me;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, getMerchantPayoutConfig, {
    keepPreviousData: true,
  });

  const refreshMerchantPayoutConfig = useCallback(() => mutate(), [mutate]);

  return useMemo(
    () => ({
      merchantPayoutConfig: data?.config || null,
      merchantPayoutConfigResponse: data || null,
      merchantPayoutConfigLoading: isLoading,
      merchantPayoutConfigError: error,
      merchantPayoutConfigValidating: isValidating,
      refreshMerchantPayoutConfig,
    }),
    [data, error, isLoading, isValidating, refreshMerchantPayoutConfig]
  );
}
