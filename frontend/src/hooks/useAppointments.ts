import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointment.service';
import { Appointment } from '../types/api.types';

/**
 * React Query Hooks для приёмов
 */

export function useAppointments(params?: {
  doctorId?: string;
  patientId?: string;
  status?: string;
  date?: string;
  time?: string;
  week?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentService.getAll(params),
    staleTime: 10000, // 10 секунд
    placeholderData: (previousData) => previousData, // Плавный переход - сохраняем предыдущие данные
    refetchOnWindowFocus: false, // Не обновлять при фокусе окна
    gcTime: 300000, // 5 минут - кешируем данные дольше
    retry: 1, // Меньше попыток для быстрого ответа
    refetchOnMount: false, // Не обновлять при монтировании если данные свежие
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => appointmentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      appointmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      appointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}


