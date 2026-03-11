import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import { identity } from 'lodash';

// ----------------------------------------------------------------------

export function useGetDealershipTypes() {
    const URL = endpoints.merchantDealershipType.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            dealershipTypes: data || [],
            dealershipTypesLoading: isLoading,
            dealershipTypesError: error,
            dealershipTypesValidating: isValidating,
            dealershipTypesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}