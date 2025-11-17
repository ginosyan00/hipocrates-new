import React, { useState, useEffect } from 'react';
import { NewDashboardLayout } from '../../components/dashboard/NewDashboardLayout';
import { Card, Button } from '../../components/common';
import { AddDoctorModal } from '../../components/dashboard/AddDoctorModal';
import { useAuthStore } from '../../store/useAuthStore';
import { userService } from '../../services/user.service';
import { User } from '../../types/api.types';

/**
 * DoctorDashboard
 * Dashboard для врачей (владельцев клиники)
 */
export const DoctorDashboard: React.FC = () => {
  const user = useAuthStore(state => state.user);
  
  // State для врачей
  const [doctors, setDoctors] = useState<User[]>([]);
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Загрузка врачей
  useEffect(() => {
    loadDoctors();
  }, []);
  
  const loadDoctors = async () => {
    try {
      setIsDoctorsLoading(true);
      const data = await userService.getDoctors();
      setDoctors(data);
      console.log('✅ Загружено врачей:', data.length);
    } catch (err: any) {
      console.error('🔴 Ошибка загрузки врачей:', err.message);
    } finally {
      setIsDoctorsLoading(false);
    }
  };
  
  const handleDoctorCreated = () => {
    // Reload doctors list
    loadDoctors();
  };

  return (
    <NewDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-text-50 mb-2">
            Добро пожаловать, Доктор {user?.name}! ⚕️
          </h1>
          <p className="text-sm text-text-10">
            Специализация: {user?.specialization || 'Не указано'} • Опыт: {user?.experience || 0} лет
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="lg">
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-2xl font-bold text-main-100 mb-1">0</h3>
              <p className="text-xs text-text-10">Пациентов сегодня</p>
            </div>
          </Card>

          <Card padding="lg">
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-2xl font-bold text-main-100 mb-1">0</h3>
              <p className="text-xs text-text-10">Предстоящих записей</p>
            </div>
          </Card>

          <Card padding="lg">
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-2xl font-bold text-main-100 mb-1">0</h3>
              <p className="text-xs text-text-10">Завершено приемов</p>
            </div>
          </Card>

          <Card padding="lg">
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="text-2xl font-bold text-main-100 mb-1">5.0</h3>
              <p className="text-xs text-text-10">Средний рейтинг</p>
            </div>
          </Card>
        </div>

        {/* Schedule & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-text-50 mb-4">Расписание на сегодня</h2>
            <div className="space-y-3">
              <div className="text-center py-8 text-text-10">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-sm">Нет запланированных приемов</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-text-50 mb-4">Быстрые действия</h2>
            <div className="space-y-3">
              <button className="w-full p-3 border border-stroke rounded-lg hover:border-main-100 hover:bg-main-100 hover:bg-opacity-5 transition-all text-left">
                <div className="flex items-center gap-3">
                  <div className="text-xl">👥</div>
                  <div>
                    <h3 className="font-medium text-text-50 text-sm">Мои пациенты</h3>
                    <p className="text-xs text-text-10">Просмотр базы пациентов</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-3 border border-stroke rounded-lg hover:border-main-100 hover:bg-main-100 hover:bg-opacity-5 transition-all text-left">
                <div className="flex items-center gap-3">
                  <div className="text-xl">📊</div>
                  <div>
                    <h3 className="font-medium text-text-50 text-sm">Статистика</h3>
                    <p className="text-xs text-text-10">Отчеты и аналитика</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-3 border border-stroke rounded-lg hover:border-main-100 hover:bg-main-100 hover:bg-opacity-5 transition-all text-left">
                <div className="flex items-center gap-3">
                  <div className="text-xl">⚙️</div>
                  <div>
                    <h3 className="font-medium text-text-50 text-sm">Настройки расписания</h3>
                    <p className="text-xs text-text-10">Управление доступностью</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Мои врачи */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-text-50">Врачи клиники</h2>
              <p className="text-xs text-text-10 mt-1">Управление врачами вашей клиники</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              ➕ Добавить врача
            </Button>
          </div>
          
          {isDoctorsLoading ? (
            <div className="text-center py-8 text-text-10">
              <div className="text-4xl mb-2">⏳</div>
              <p className="text-sm">Загрузка...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8 text-text-10">
              <div className="text-4xl mb-2">👨‍⚕️</div>
              <p className="text-sm mb-3">Пока нет врачей в клинике</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Добавить первого врача
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doctor => (
                <Card key={doctor.id} className="border border-stroke" padding="md">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-main-100 bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⚕️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-50 text-sm truncate">{doctor.name}</h3>
                      <p className="text-xs text-text-10 truncate">{doctor.specialization}</p>
                      <p className="text-xs text-text-10 mt-1 truncate">📧 {doctor.email}</p>
                      {doctor.phone && (
                        <p className="text-xs text-text-10 truncate">📱 {doctor.phone}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded">
                          {doctor.experience} лет опыта
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">
                          {doctor.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* License Info */}
        <Card className="bg-green-50 border-green-200" padding="md">
          <p className="text-sm text-green-800">
            <strong>✅ Лицензия подтверждена:</strong> {user?.licenseNumber || 'Не указано'}
          </p>
        </Card>
      </div>
      
      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleDoctorCreated}
      />
    </NewDashboardLayout>
  );
};

