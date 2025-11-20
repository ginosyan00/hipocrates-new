import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { User } from '../types/api.types';
import { useAuthStore } from '../store/useAuthStore';

/**
 * React Query Hooks для пользователей
 */

export function useUsers(params?: { role?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
    staleTime: 30000,
  });
}

export function useDoctors() {
  return useQuery({
    queryKey: ['users', 'doctors'],
    queryFn: () => userService.getDoctors(),
    staleTime: 60000, // 1 минута
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: (updatedUser) => {
      // Инвалидируем кэш списка пользователей
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Инвалидируем кэш списка врачей
      queryClient.invalidateQueries({ queryKey: ['users', 'doctors'] });
      
      // Инвалидируем кэш конкретного пользователя
      queryClient.invalidateQueries({ queryKey: ['users', updatedUser.id] });
      
      // Если обновлен врач, инвалидируем его профиль (чтобы врач видел изменения)
      if (updatedUser.role === 'DOCTOR') {
        queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['doctor', 'profile', updatedUser.id] });
      }

      // Если обновлен текущий пользователь, обновляем store
      if (currentUser && currentUser.id === updatedUser.id) {
        useAuthStore.setState({ user: updatedUser });
      }
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}


