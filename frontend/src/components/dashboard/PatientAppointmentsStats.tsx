import React, { useMemo } from 'react';
import { Card } from '../common';
import { Appointment } from '../../types/api.types';
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

interface PatientAppointmentsStatsProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

/**
 * PatientAppointmentsStats Component
 * Գեղեցիկ վիճակագրություն պացիենտի գրանցումների համար
 */
export const PatientAppointmentsStats: React.FC<PatientAppointmentsStatsProps> = ({
  appointments,
  isLoading = false,
}) => {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Предстоящие записи
    const upcoming = appointments.filter(
      (apt) => new Date(apt.appointmentDate) >= now && apt.status !== 'cancelled'
    );

    // Записи по статусам
    const confirmed = appointments.filter((apt) => apt.status === 'confirmed');
    const pending = appointments.filter((apt) => apt.status === 'pending');
    const completed = appointments.filter((apt) => apt.status === 'completed');
    const cancelled = appointments.filter((apt) => apt.status === 'cancelled');

    // Записи по периодам
    const todayAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow && apt.status !== 'cancelled';
    });

    const tomorrowAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= tomorrow && aptDate < nextWeek && apt.status !== 'cancelled';
    });

    const weekAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < nextWeek && apt.status !== 'cancelled';
    });

    // Завершенные за последний месяц
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const recentCompleted = completed.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= monthAgo;
    });

    // Всего визитов
    const totalVisits = completed.length;

    return {
      upcoming: upcoming.length,
      confirmed: confirmed.length,
      pending: pending.length,
      completed: totalVisits,
      cancelled: cancelled.length,
      today: todayAppointments.length,
      tomorrow: tomorrowAppointments.length,
      week: weekAppointments.length,
      recentCompleted: recentCompleted.length,
    };
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} padding="lg" className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Предстоящие',
      value: stats.upcoming,
      subtitle: 'активных записей',
      icon: Calendar,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Подтверждено',
      value: stats.confirmed,
      subtitle: 'готовы к приему',
      icon: CheckCircle2,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
    },
    {
      title: 'Ожидает',
      value: stats.pending,
      subtitle: 'требуют подтверждения',
      icon: AlertCircle,
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Всего визитов',
      value: stats.completed,
      subtitle: 'завершенных приемов',
      icon: TrendingUp,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
    },
  ];

  const periodCards = [
    {
      title: 'Сегодня',
      value: stats.today,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Завтра',
      value: stats.tomorrow,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'На неделе',
      value: stats.week,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'За месяц',
      value: stats.recentCompleted,
      icon: CheckCircle2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Основные статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              padding="lg"
              className={`bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700 mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-xs text-gray-600">{stat.subtitle}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Карточки по периодам */}
      <Card padding="lg" className="border border-stroke">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-50">Распределение по времени</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {periodCards.map((period, index) => {
            const Icon = period.icon;
            return (
              <div
                key={period.title}
                className="p-4 border border-stroke rounded-lg hover:border-main-100 hover:bg-main-10 transition-all duration-200 animate-in fade-in slide-in-from-left-4"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${period.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${period.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-10">{period.title}</p>
                    <p className={`text-2xl font-bold ${period.color}`}>{period.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Статусы записей */}
      {stats.cancelled > 0 && (
        <Card padding="lg" className="border border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-900">Отмененных записей: {stats.cancelled}</p>
              <p className="text-xs text-red-700">Проверьте историю отмененных приемов</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

