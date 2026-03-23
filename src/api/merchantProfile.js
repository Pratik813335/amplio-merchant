import useSWR from 'swr';
import { useCallback, useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBankDetails() {
  const URL = endpoints.merchantProfile.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshDetails = () => {
    mutate();
  };

  return {
    BankDetails: data?.bankDetails || [],
    BankDetailsLoading: isLoading,
    BankDetailsError: error,
    BankDetailsValidating: isValidating,
    BankDetailsEmpty: !isLoading && (!data?.bankDetails || data.bankDetails.length === 0),
    refreshDetails,
  };
}


// ----------------------------------------------------------------------

export function useGetBankDetail(accountId) {
  const URL = accountId ? endpoints.bankDetails.details(accountId) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshBankDetail = () => {
    mutate();
  };

  return {
    bankDetail: data?.bankDetails || [],
    bankDetailLoading: isLoading,
    bankDetailError: error,
    bankDetailValidating: isValidating,
    refreshBankDetail,
  };
}

// ----------------------------------------------------------------------

export function useFilterBankDetails(queryString) {
  const URL = queryString ? endpoints.bankDetails.filterList(queryString) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      filteredBankDetails: data?.bankDetails || [],
      filterLoading: isLoading,
      filterError: error,
      filterValidating: isValidating,
      filterEmpty: !isLoading && (!data?.bankDetails || data.bankDetails.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export default function useGetProfileData() {
  const URL = endpoints.merchantProfile.profileData;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });



  return {
    profileData: data?.profile || null,
    loading: isLoading,
    error,
    validating: isValidating,

  };
}

export function useGetUBOSData() {
  const URL = endpoints.merchantProfile.uboDetails;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshUbos = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    uboDetails: data?.UboDetails || [],
    loading: isLoading,
    error,
    validating: isValidating,
    eempty: !isLoading && !(data?.UboDetails?.length),
    refreshUbos,
  };
}

export function useGetPSPData() {
  const URL = endpoints.merchantProfile.pspDetails;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDetails = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    pspDetails: data?.pspDetails || [],
    loading: isLoading,
    error,
    validating: isValidating,
    eempty: !isLoading && !(data?.pspDetails?.length),
    refreshDetails,
  };
}