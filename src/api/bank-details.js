import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBankDetails() {
  const URL = endpoints.bankDetails.list;

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