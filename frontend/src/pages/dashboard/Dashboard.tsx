import React, { useState, useEffect } from 'react';
import { NewDashboardLayout } from '../../components/dashboard/NewDashboardLayout';
import { AppointmentChart } from '../../components/dashboard/AppointmentChart';
import { DoctorProfile } from '../../components/dashboard/DoctorProfile';
import { Card, Button } from '../../components/common';
import { AddDoctorModal } from '../../components/dashboard/AddDoctorModal';
import { userService } from '../../services/user.service';
import { User } from '../../types/api.types';

// Import icons
import messageIcon from '../../assets/icons/message.svg';
import walletIcon from '../../assets/icons/wallet.svg';
import patientIcon from '../../assets/icons/patient.svg';

/**
 * Dashboard Page
 * Գեղեցիկ dashboard կլինիկայի համար
 */
export const DashboardPage: React.FC = () => {
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
    } catch (err: any) {
      console.error('Ошибка загрузки врачей:', err.message);
    } finally {
      setIsDoctorsLoading(false);
    }
  };
  
  const handleDoctorCreated = () => {
    loadDoctors();
  };

  // Mock data for appointments table
  const upcomingAppointments = [
    {
      id: 1,
      patientName: 'Darrell Steward',
      date: '15 July 2020, 9:00 AM',
      service: 'Chiropractic Care',
    },
    {
      id: 2,
      patientName: 'Brooklyn Simmons',
      date: '15 July 2020, 9:00 AM',
      service: 'Nephrology (Kidneys)',
    },
    {
      id: 3,
      patientName: 'Cameron Williamson',
      date: '15 July 2020, 9:00 AM',
      service: 'Diabetes Education',
    },
  ];

  return (
    <NewDashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - Left Side */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Payments */}
            <Card padding="none" className="p-5">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-main-10 rounded-sm flex items-center justify-center">
                  <img src={walletIcon} alt="Wallet" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-normal text-text-10 mb-1">Total Payments</p>
                  <p className="text-2xl font-medium text-text-100">$45,214.00</p>
                </div>
              </div>
            </Card>

            {/* New Patients */}
            <Card padding="none" className="p-5">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-secondary-10 rounded-sm flex items-center justify-center">
                  <img src={patientIcon} alt="Patients" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-normal text-text-10 mb-1">New Patients</p>
                  <p className="text-2xl font-medium text-text-100">5,325</p>
                </div>
              </div>
            </Card>

            {/* Important Tasks */}
            <Card padding="none" className="p-5">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-secondary-10 rounded-sm flex items-center justify-center">
                  <img src={messageIcon} alt="Tasks" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-normal text-text-10 mb-1">Important Tasks</p>
                  <p className="text-2xl font-medium text-text-100">1,253</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Appointment Chart */}
          <AppointmentChart />

          {/* Команда врачей - зберігаємо функціонал додавання */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-text-50">Команда врачей</h2>
                <p className="text-xs text-text-10 mt-1">Управление специалистами клиники</p>
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
              <div className="text-center py-12 text-text-10">
                <div className="text-5xl mb-3 animate-pulse">⏳</div>
                <p className="text-sm">Загрузка...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12 text-text-10">
                <div className="text-5xl mb-3">👨‍⚕️</div>
                <p className="text-sm mb-4">Добавьте первого врача в вашу клинику</p>
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  ➕ Добавить врача
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map(doctor => (
                  <Card key={doctor.id} className="border-2 border-stroke hover:border-main-100 hover:shadow-md transition-all" padding="md">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-main-10 rounded-sm flex items-center justify-center flex-shrink-0">
                        <span className="text-base text-main-100 font-medium">
                          {doctor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-50 truncate">{doctor.name}</h3>
                        <p className="text-xs text-main-100 font-medium truncate">{doctor.specialization}</p>
                        <p className="text-xs text-text-10 mt-2 truncate">📧 {doctor.email}</p>
                        {doctor.phone && (
                          <p className="text-xs text-text-10 truncate">📱 {doctor.phone}</p>
                        )}
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] font-medium rounded">
                            {doctor.experience} лет
                          </span>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">
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

          {/* Upcoming Appointments Table */}
          <Card padding="none" className="p-5">
            <h3 className="text-lg font-medium text-text-50 mb-6">Upcoming Appointment</h3>
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-stroke mb-4">
              <div className="col-span-4 text-sm font-normal text-text-10">Patient name</div>
              <div className="col-span-3 text-sm font-normal text-text-10">Date</div>
              <div className="col-span-3 text-sm font-normal text-text-10">Service</div>
              <div className="col-span-2 text-sm font-normal text-text-10">Action</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-main-10 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-main-100 font-medium">
                        {appointment.patientName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-text-100">{appointment.patientName}</span>
                  </div>
                  <div className="col-span-3 text-xs font-medium text-text-50">{appointment.date}</div>
                  <div className="col-span-3 text-xs font-normal text-text-10">{appointment.service}</div>
                  <div className="col-span-2">
                    <button className="bg-main-10 text-main-100 px-6 py-1.5 rounded-sm text-xs font-normal hover:bg-main-100 hover:text-white transition-smooth">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Doctor Profile */}
        <div className="w-full lg:w-[357px] flex-shrink-0">
          <DoctorProfile />
        </div>
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
