import { useMutation } from '@tanstack/react-query';
import { registerRequest, loginRequest } from '../api/auth';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { RegisterPayload, LoginPayload } from '../types';

export const useRegister = () => {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
};

export const useLogin = () => {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
};
