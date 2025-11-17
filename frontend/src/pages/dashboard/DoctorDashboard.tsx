import React from 'react';
import { NewDashboardLayout } from '../../components/dashboard/NewDashboardLayout';
import { Card } from '../../components/common';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * DoctorDashboard
 * Dashboard для врачей (владельцев клиники)
 */
export const DoctorDashboard: React.FC = () => {
  const user = useAuthStore(state => state.user);

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

        {/* License Info */}
        <Card className="bg-green-50 border-green-200" padding="md">
          <p className="text-sm text-green-800">
            <strong>✅ Лицензия подтверждена:</strong> {user?.licenseNumber || 'Не указано'}
          </p>
        </Card>
      </div>
    </NewDashboardLayout>
  );
};

