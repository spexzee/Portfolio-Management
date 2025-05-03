import {useApi} from '../useApi';
import { useQuery } from '@tanstack/react-query';

export interface Project {
  name: string;
  description: string;
  tags:string[];
}

export interface ProjectsResponse {
  projects: Project[];
}

// const projectsMapper = (response: ProjectsResponse): Project[] => {
//   return response.projects.map(project => ({
//     name: project.name,
//     description: project.description,
//     tags: project.tags
//   }))
// };

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await useApi<null, ProjectsResponse>({ method: 'GET', url: '/api/project/projects' });
      return response as ProjectsResponse
    },
  });
};
