import React, { useState } from 'react';
import { NewDashboardLayout } from '../../components/dashboard/NewDashboardLayout';
import { Button, Card, Spinner } from '../../components/common';
import { useAppointments, useUpdateAppointmentStatus } from '../../hooks/useAppointments';

/**
 * Appointments Page - Figma Design
 * Управление приёмами в новом стиле
 */
export const AppointmentsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const { data, isLoading, error } = useAppointments({
    status: statusFilter || undefined,
    date: dateFilter || undefined,
  });
  const updateStatusMutation = useUpdateAppointmentStatus();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Ошибка изменения статуса');
    }
  };

  if (isLoading) {
    return (
      <NewDashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      </NewDashboardLayout>
    );
  }

  if (error) {
    return (
      <NewDashboardLayout>
        <div>
          <Card className="bg-red-50 border-red-200">
            <p className="text-red-600 text-sm">Ошибка загрузки: {(error as any).message}</p>
          </Card>
        </div>
      </NewDashboardLayout>
    );
  }

  const appointments = data?.appointments || [];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      confirmed: 'bg-main-10 text-main-100 border-main-100/20',
      completed: 'bg-secondary-10 text-secondary-100 border-secondary-100/20',
      cancelled: 'bg-bg-primary text-text-10 border-stroke',
    };
    const labels = {
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      completed: 'Завершен',
      cancelled: 'Отменен',
    };
    return (
      <span className={`px-3 py-1 border rounded-sm text-xs font-normal ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <NewDashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-100">Приёмы</h1>
          <p className="text-text-10 text-sm mt-1">Всего: {data?.meta.total || 0}</p>
        </div>
        <Button variant="primary">➕ Создать приём</Button>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-normal text-text-10 mb-2">Статус</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="block w-full px-4 py-2.5 border border-stroke rounded-sm bg-bg-white text-sm focus:outline-none focus:border-main-100 transition-smooth"
            >
              <option value="">Все</option>
              <option value="pending">Ожидает подтверждения</option>
              <option value="confirmed">Подтвержден</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-normal text-text-10 mb-2">Дата</label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="block w-full px-4 py-2.5 border border-stroke rounded-sm bg-bg-white text-sm focus:outline-none focus:border-main-100 transition-smooth"
            />
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-text-10 text-sm">
            Приёмы не найдены
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map(appointment => (
            <Card key={appointment.id} padding="md">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-main-10 rounded-sm flex items-center justify-center">
                      <span className="text-sm text-main-100 font-medium">
                        {appointment.patient?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-text-100">
                        {appointment.patient?.name}
                      </h3>
                      <p className="text-xs text-text-10">{appointment.patient?.email}</p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-normal text-text-10 mb-1">Врач:</p>
                      <p className="font-medium text-text-50">{appointment.doctor?.name}</p>
                      <p className="text-text-10">{appointment.doctor?.specialization}</p>
                    </div>
                    <div>
                      <p className="font-normal text-text-10 mb-1">Дата и время:</p>
                      <p className="font-medium text-text-50">
                        {new Date(appointment.appointmentDate).toLocaleString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-text-10">Длительность: {appointment.duration} мин</p>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="text-xs">
                      <p className="font-normal text-text-10 mb-1">Причина визита:</p>
                      <p className="text-text-50">{appointment.reason}</p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="text-xs">
                      <p className="font-normal text-text-10 mb-1">Заметки:</p>
                      <p className="text-text-50">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {appointment.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                    >
                      Подтвердить
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                    >
                      Завершить
                    </Button>
                  )}
                  {['pending', 'confirmed'].includes(appointment.status) && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    >
                      Отменить
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </NewDashboardLayout>
  );
};
