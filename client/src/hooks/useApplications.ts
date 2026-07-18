import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  fetchApplications,
  fetchStats,
  createApplicationRequest,
  updateApplicationRequest,
  deleteApplicationRequest,
} from '../api/applications';
import { ApplicationFilters, ApplicationInput } from '../types';

export const useApplications = (filters: ApplicationFilters) => {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => fetchApplications(filters),
    placeholderData: keepPreviousData,
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });
};

const useInvalidateApplications = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  };
};

export const useCreateApplication = () => {
  const invalidate = useInvalidateApplications();
  return useMutation({
    mutationFn: (input: ApplicationInput) => createApplicationRequest(input),
    onSuccess: invalidate,
  });
};

export const useUpdateApplication = () => {
  const invalidate = useInvalidateApplications();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ApplicationInput }) =>
      updateApplicationRequest(id, input),
    onSuccess: invalidate,
  });
};

export const useDeleteApplication = () => {
  const invalidate = useInvalidateApplications();
  return useMutation({
    mutationFn: (id: string) => deleteApplicationRequest(id),
    onSuccess: invalidate,
  });
};
