import React, { useState } from 'react';
import { NewDashboardLayout } from '../../components/dashboard/NewDashboardLayout';
import { Button, Input, Card, Modal, Spinner } from '../../components/common';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../../hooks/usePatients';
import { Patient } from '../../types/api.types';

// Import search icon
import searchIcon from '../../assets/icons/search.svg';

/**
 * Patients Page - Figma Design
 * Управление пациентами в новом стиле
 */
export const PatientsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const { data, isLoading, error } = usePatients({ search });
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    notes: '',
  });

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        phone: patient.phone,
        email: patient.email || '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        notes: patient.notes || '',
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPatient) {
        await updateMutation.mutateAsync({
          id: editingPatient.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving patient:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Удалить пациента ${name}?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting patient:', err);
      }
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
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600 text-sm">Ошибка загрузки: {(error as any).message}</p>
        </Card>
      </NewDashboardLayout>
    );
  }

  const patients = data?.patients || [];

  return (
    <NewDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-100">Пациенты</h1>
          <p className="text-text-10 text-sm mt-1">Всего: {data?.meta.total || 0}</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">➕ Добавить пациента</Button>
      </div>

      {/* Search */}
      <Card padding="md">
        <Input
          placeholder="Поиск по имени или телефону..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<img src={searchIcon} alt="Search" className="w-4 h-4" />}
        />
      </Card>

      {/* Patients Grid */}
      {patients.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-text-10 text-sm">
            {search ? 'Пациенты не найдены' : 'Нет пациентов. Добавьте первого!'}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map(patient => (
            <Card key={patient.id} padding="md">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-main-10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-base text-main-100 font-medium">
                      {patient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-text-100 truncate">{patient.name}</h3>
                    <p className="text-xs text-text-50">{patient.phone}</p>
                    {patient.email && <p className="text-xs text-text-10 truncate">{patient.email}</p>}
                  </div>
                </div>

                {patient.notes && (
                  <p className="text-xs text-text-10 line-clamp-2">{patient.notes}</p>
                )}

                <div className="flex gap-2 pt-2 border-t border-stroke">
                  <Button size="sm" variant="secondary" onClick={() => handleOpenModal(patient)}>
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(patient.id, patient.name)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? 'Редактировать пациента' : 'Добавить пациента'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ФИО"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Телефон"
              type="tel"
              placeholder="+374 98 123456"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="patient@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Дата рождения"
              type="date"
              value={formData.dateOfBirth}
              onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <div>
              <label className="block text-sm font-normal text-text-10 mb-2">Пол</label>
              <select
                value={formData.gender}
                onChange={e =>
                  setFormData({ ...formData, gender: e.target.value as any })
                }
                className="block w-full px-4 py-2.5 border border-stroke rounded-sm bg-bg-white text-sm focus:outline-none focus:border-main-100 transition-smooth"
              >
                <option value="">Не указан</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="other">Другой</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-normal text-text-10 mb-2">Заметки</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="block w-full px-4 py-2.5 border border-stroke rounded-sm bg-bg-white text-sm focus:outline-none focus:border-main-100 transition-smooth resize-none"
              placeholder="Аллергии, особые указания..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingPatient ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
      </div>
    </NewDashboardLayout>
  );
};
