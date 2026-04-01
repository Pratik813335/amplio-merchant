import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// export function useGetTransactions() {
//   const URL = endpoints.transactions.list;

//   const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
//     const refreshTrasnsactions = () => {
//     mutate();
//   };

//   const memoizedValue = useMemo(
//     () => ({
//       transaction: data || [],
//       transactionLoading: isLoading,
//       transactionError: error,
//       transactionValidating: isValidating,
//       transactionEmpty: !isLoading && (!data || data.length === 0),
//       refreshTrasnsactions,
//     }),
//     [data, error, isLoading, isValidating, mutate]
//   );


//   return memoizedValue;
// }


export function useGetTransactions() {
  const URL = endpoints.transactions.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const refreshTrasnsactions = () => {
    mutate();
  };

  return {
    transaction: data || [],
    transactionLoading: isLoading,
    transactionError: error,
    transactionValidating: isValidating,
    transactionEmpty: !isLoading && (!data || data.length === 0),
    refreshTrasnsactions,
  };
}
