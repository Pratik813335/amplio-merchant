import useSWR from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------
export function useGetPspDetails() {
  // const URL = endpoints.pspDetails.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshDetails = () => {
    mutate();
  };
 
  return {
    PspDetails: data?.pspDetails || [],
    PspDetailsLoading: isLoading,
    PspDetailsError: error,
    PspDetailsValidating: isValidating,
    PspDetailsEmpty: !isLoading && (!data?.pspDetails || data.pspDetails.length === 0),
    refreshDetails,
  };
}
