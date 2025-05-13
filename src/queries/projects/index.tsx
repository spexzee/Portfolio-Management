import { toast } from '@/hooks/use-toast';
import useApi from '../useApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/lib/types';

export interface ProjectsResponse {
  projects: Project[];
}

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const response = await useApi<ProjectsResponse>( 'GET','/api/project/projects');
      return response.projects;
    },
  });
};

export const useAddProject =() => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : async (project: Project) => {
       await useApi('POST', '/api/project/create-project', project)
    },
    onSuccess : () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error : any) => {
      toast({
        title: "Error",
        description: `${error.response.data.message}`,
        variant: "destructive",
      });
    },
  })
}

export const useEditProject = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Project) => {
      await useApi('PUT', `/api/project/update-project/${project._id}`, project);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `${error.response.data.message}`,
        variant: "destructive",
      });
    },
  })
}

export const useDeleteProject = () => {
   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId : string) => {
      await useApi('DELETE', `/api/project/delete-project/${projectId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `${error.response.data.message}`,
        variant: "destructive",
      });
    },
  })
}