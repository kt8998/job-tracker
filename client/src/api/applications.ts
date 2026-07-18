import apiClient from './client';
import {
  ApplicationsResponse,
  JobApplication,
  StatsResponse,
  ApplicationInput,
  ApplicationFilters,
} from '../types';

export const fetchApplications = async (
  filters: ApplicationFilters
): Promise<ApplicationsResponse> => {
  const { data } = await apiClient.get<ApplicationsResponse>('/applications', {
    params: filters,
  });
  return data;
};

export const fetchStats = async (): Promise<StatsResponse> => {
  const { data } = await apiClient.get<StatsResponse>('/applications/stats');
  return data;
};

export const createApplicationRequest = async (
  input: ApplicationInput
): Promise<JobApplication> => {
  const { data } = await apiClient.post<{ application: JobApplication }>(
    '/applications',
    input
  );
  return data.application;
};

export const updateApplicationRequest = async (
  id: string,
  input: ApplicationInput
): Promise<JobApplication> => {
  const { data } = await apiClient.put<{ application: JobApplication }>(
    `/applications/${id}`,
    input
  );
  return data.application;
};

export const deleteApplicationRequest = async (id: string): Promise<void> => {
  await apiClient.delete(`/applications/${id}`);
};
