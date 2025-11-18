import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from '../common';
import { useAppointments } from '../../hooks/useAppointments';
import { usePatients } from '../../hooks/usePatients';
import { Appointment, Patient } from '../../types/api.types';

// Import icons
import calendarIcon from '../../assets/icons/calendar.svg';
import patientIcon from '../../assets/icons/patient.svg';
import notificationIcon from '../../assets/icons/notification.svg';

/**
 * OverviewSection Component
 * Обзорная секция для Dashboard (только для CLINIC роли)
 * Показывает статистику и данные из всех разделов
 */
export const OverviewSection: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    appointments: true,
    patients: false,
  });

  // Загружаем данные
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useAppointments({
    limit: 50, // Больше данных для статистики
  });

  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    limit: 20,
  });

  // Вычисляем статистику
  const stats = useMemo(() => {
    const appointments = appointmentsData?.appointments || [];
    const patients = patientsData?.patients || [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Предстоящие записи (сегодня и завтра)
    const upcomingAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return (
        aptDate >= today &&
        aptDate < nextWeek &&
        (apt.status === 'pending' || apt.status === 'confirmed')
      );
    });

    // Новые пациенты (за последнюю неделю)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newPatients = patients.filter(patient => {
      const created = new Date(patient.createdAt);
      return created >= weekAgo;
    });

    // Записи, требующие подтверждения
    const pendingAppointments = appointments.filter(
      apt => apt.status === 'pending'
    );

    return {
      upcomingAppointments: upcomingAppointments.length,
      newPatients: newPatients.length,
      pendingAppointments: pendingAppointments.length,
      upcomingList: upcomingAppointments.slice(0, 5),
      recentPatients: patients.slice(0, 5),
    };
  }, [appointmentsData, patientsData]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPatientDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div>
        <h2 className="text-xl font-semibold text-text-50">Обзор</h2>
        <p className="text-sm text-text-10 mt-1">
          Краткая информация из всех разделов клиники
        </p>
      </div>

      {/* Статистика - 3 карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Предстоящие записи */}
        <Card padding="md" className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-text-10 mb-2">Предстоящие записи</p>
              <p className="text-2xl font-semibold text-text-100">
                {isLoadingAppointments ? (
                  <Spinner size="sm" />
                ) : (
                  stats.upcomingAppointments
                )}
              </p>
              <p className="text-xs text-text-10 mt-1">на ближайшие 7 дней</p>
            </div>
            <div className="w-12 h-12 bg-main-10 rounded-lg flex items-center justify-center">
              <img src={calendarIcon} alt="Calendar" className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Новые пациенты */}
        <Card padding="md" className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-text-10 mb-2">Новые пациенты</p>
              <p className="text-2xl font-semibold text-text-100">
                {isLoadingPatients ? (
                  <Spinner size="sm" />
                ) : (
                  stats.newPatients
                )}
              </p>
              <p className="text-xs text-text-10 mt-1">за последнюю неделю</p>
            </div>
            <div className="w-12 h-12 bg-secondary-10 rounded-lg flex items-center justify-center">
              <img src={patientIcon} alt="Patients" className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Требуют подтверждения */}
        <Card padding="md" className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-text-10 mb-2">Требуют подтверждения</p>
              <p className="text-2xl font-semibold text-text-100">
                {isLoadingAppointments ? (
                  <Spinner size="sm" />
                ) : (
                  stats.pendingAppointments
                )}
              </p>
              <p className="text-xs text-text-10 mt-1">ожидают действия</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <img src={notificationIcon} alt="Notifications" className="w-6 h-6" />
            </div>
          </div>
        </Card>

      </div>

      {/* Предстоящие записи - Expandable блок */}
      <Card padding="lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('appointments')}
        >
          <div>
            <h3 className="text-lg font-semibold text-text-50">
              Предстоящие записи
            </h3>
            <p className="text-xs text-text-10 mt-1">
              Ближайшие записи на приём
            </p>
          </div>
          <button className="text-text-10 hover:text-text-50 transition-colors">
            {expandedSections.appointments ? '▼' : '▶'}
          </button>
        </div>

        {expandedSections.appointments && (
          <div className="mt-4 space-y-3">
            {isLoadingAppointments ? (
              <div className="text-center py-8">
                <Spinner />
                <p className="text-sm text-text-10 mt-2">Загрузка записей...</p>
              </div>
            ) : stats.upcomingList.length === 0 ? (
              <div className="text-center py-8 text-text-10">
                <p className="text-sm">Нет предстоящих записей</p>
              </div>
            ) : (
              <>
                {stats.upcomingList.map((appointment: Appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 border border-stroke rounded-lg hover:border-main-100 hover:bg-main-10 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-main-10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-main-100">
                          {appointment.patient?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-50 truncate">
                          {appointment.patient?.name || 'Неизвестный пациент'}
                        </p>
                        <p className="text-xs text-text-10">
                          {appointment.doctor?.name || 'Врач не указан'} •{' '}
                          {formatDate(appointment.appointmentDate)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {appointment.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}
                    </span>
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/dashboard/appointments')}
                    className="w-full"
                  >
                    Показать все записи →
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Недавние пациенты - Expandable блок */}
      <Card padding="lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('patients')}
        >
          <div>
            <h3 className="text-lg font-semibold text-text-50">
              Недавние пациенты
            </h3>
            <p className="text-xs text-text-10 mt-1">
              Последние добавленные пациенты
            </p>
          </div>
          <button className="text-text-10 hover:text-text-50 transition-colors">
            {expandedSections.patients ? '▼' : '▶'}
          </button>
        </div>

        {expandedSections.patients && (
          <div className="mt-4 space-y-3">
            {isLoadingPatients ? (
              <div className="text-center py-8">
                <Spinner />
                <p className="text-sm text-text-10 mt-2">Загрузка пациентов...</p>
              </div>
            ) : stats.recentPatients.length === 0 ? (
              <div className="text-center py-8 text-text-10">
                <p className="text-sm">Нет пациентов</p>
              </div>
            ) : (
              <>
                {stats.recentPatients.map((patient: Patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 border border-stroke rounded-lg hover:border-main-100 hover:bg-main-10 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-secondary-10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-secondary-100">
                          {patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-50 truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-text-10">
                          {patient.phone} • {formatPatientDate(patient.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/dashboard/patients')}
                    className="w-full"
                  >
                    Показать всех пациентов →
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* FAQ - Один вопрос с аккордеоном */}
      <Card padding="lg" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div>
          <h3 className="text-lg font-semibold text-text-50 mb-4">
            Часто задаваемые вопросы
          </h3>
          
          <FAQAccordion
            question="Как добавить нового врача в клинику?"
            answer="Для добавления нового врача перейдите в раздел 'Сотрудники' (Staff) в меню Dashboard. Нажмите кнопку 'Добавить сотрудника' и заполните форму с данными врача: имя, email, специализация, номер лицензии и опыт работы. После сохранения врач получит доступ к системе."
          />
        </div>
      </Card>
    </div>
  );
};

/**
 * FAQ Accordion Component
 * Компонент для отображения вопроса и ответа
 */
interface FAQAccordionProps {
  question: string;
  answer: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100 transition-colors"
      >
        <span className="font-medium text-text-50 pr-4">{question}</span>
        <span className="text-blue-600 text-xl flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-blue-200">
          <p className="text-sm text-text-10 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

