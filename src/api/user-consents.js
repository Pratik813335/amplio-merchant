import useSWR from 'swr';
import { useCallback, useMemo } from 'react';

import { endpoints, fetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetUserConsents({ sessionId, identifierId } = {}) {
  let URL = null;

  if (sessionId) {
    URL = endpoints.userConsents.listBySessionId(sessionId);
  } else if (identifierId) {
    URL = endpoints.userConsents.listByIdentifierId(identifierId);
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshUserConsents = useCallback(() => mutate(), [mutate]);

  return useMemo(
    () => ({
      userConsents: data || [],
      userConsentsLoading: isLoading,
      userConsentsError: error,
      userConsentsValidating: isValidating,
      refreshUserConsents,
    }),
    [data, error, isLoading, isValidating, refreshUserConsents]
  );
}
