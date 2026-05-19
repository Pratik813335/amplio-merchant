import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------

export function useGetConsentDetails(slug) {
    const URL = slug ? endpoints.consent.data.replace('{slug}', slug) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            consentDetails: data || null,
            consentDetailsLoading: isLoading,
            consentDetailsError: error,
            consentDetailsValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
