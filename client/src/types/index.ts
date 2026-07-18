export type Status = 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: Status;
  jobUrl: string | null;
  notes: string | null;
  salary: number | null;
  location: string | null;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApplicationsResponse {
  applications: JobApplication[];
  pagination: Pagination;
}

export interface StatsResponse {
  APPLIED: number;
  INTERVIEWING: number;
  OFFER: number;
  REJECTED: number;
  total: number;
}

export interface ApplicationInput {
  company: string;
  role: string;
  status?: Status;
  jobUrl?: string;
  notes?: string;
  salary?: number;
  location?: string;
  appliedDate?: string;
}

export interface ApplicationFilters {
  status?: Status;
  search?: string;
  page?: number;
  limit?: number;
}
