import useApi from '../useApi';
import { useQuery } from '@tanstack/react-query';
type Counts = {
  projects: number;
  technologies: number;
}
export interface ProjectsResponse {
  counts: Counts;
}
export const useGetCounts = () => {
  return useQuery({
    queryKey: ['counts'],
    queryFn: async () => {
      const response = await useApi<ProjectsResponse>( 'GET','/api/common/get-counts');
      return response.counts;
    },
  });
};