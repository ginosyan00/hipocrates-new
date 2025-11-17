import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seed Database
 * Создает тестовые данные для разработки
 */
async function main() {
  console.log('🌱 Starting seed...');

  // 1. Создаем тестовую клинику
  const clinic = await prisma.clinic.create({
    data: {
      name: 'Дента Люкс',
      slug: 'denta-lux',
      email: 'info@dentalux.am',
      phone: '+374 98 123456',
      city: 'Yerevan',
      address: 'ул. Абовяна 10',
      about: 'Современная стоматологическая клиника в центре Еревана',
      workingHours: JSON.stringify({
        monday: { open: '09:00', close: '18:00', isOpen: true },
        tuesday: { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '18:00', isOpen: true },
        thursday: { open: '09:00', close: '18:00', isOpen: true },
        friday: { open: '09:00', close: '18:00', isOpen: true },
        saturday: { open: '10:00', close: '14:00', isOpen: true },
        sunday: { open: null, close: null, isOpen: false },
      }),
    },
  });

  console.log('✅ Clinic created:', clinic.name);

  // 2. Создаем администратора
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.create({
    data: {
      clinicId: clinic.id,
      name: 'Арам Григорян',
      email: 'admin@dentalux.am',
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '+374 98 111222',
    },
  });

  console.log('✅ Admin created:', admin.email);

  // 3. Создаем врачей
  const doctorPasswordHash = await bcrypt.hash('Doctor123!', 12);
  
  const doctor1 = await prisma.user.create({
    data: {
      clinicId: clinic.id,
      name: 'Д-р Карен Саркисян',
      email: 'karen@dentalux.am',
      passwordHash: doctorPasswordHash,
      role: 'doctor',
      specialization: 'Терапевт',
      phone: '+374 98 222333',
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      clinicId: clinic.id,
      name: 'Д-р Анна Петросян',
      email: 'anna@dentalux.am',
      passwordHash: doctorPasswordHash,
      role: 'doctor',
      specialization: 'Хирург',
      phone: '+374 98 333444',
    },
  });

  console.log('✅ Doctors created:', doctor1.name, doctor2.name);

  // 4. Создаем пациентов
  const patient1 = await prisma.patient.create({
    data: {
      clinicId: clinic.id,
      name: 'Мария Асатрян',
      phone: '+374 98 444555',
      email: 'maria@example.com',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'female',
      notes: 'Аллергия на лидокаин',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      clinicId: clinic.id,
      name: 'Давид Манукян',
      phone: '+374 98 555666',
      email: 'david@example.com',
      dateOfBirth: new Date('1985-08-22'),
      gender: 'male',
    },
  });

  console.log('✅ Patients created:', patient1.name, patient2.name);

  // 5. Создаем приёмы
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const appointment1 = await prisma.appointment.create({
    data: {
      clinicId: clinic.id,
      doctorId: doctor1.id,
      patientId: patient1.id,
      appointmentDate: tomorrow,
      duration: 30,
      status: 'confirmed',
      reason: 'Профилактический осмотр',
      notes: '',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);

  const appointment2 = await prisma.appointment.create({
    data: {
      clinicId: clinic.id,
      doctorId: doctor2.id,
      patientId: patient2.id,
      appointmentDate: nextWeek,
      duration: 60,
      status: 'pending',
      reason: 'Удаление зуба',
      notes: '',
    },
  });

  console.log('✅ Appointments created:', appointment1.id, appointment2.id);

  // 6. Создаем тестовую CLINIC (владелец клиники)
  const clinic2 = await prisma.clinic.create({
    data: {
      name: 'Медицинский центр Здоровье',
      slug: 'zdorovie-clinic',
      email: 'info@zdorovie.am',
      phone: '+374 10 123456',
      city: 'Yerevan',
      address: 'пр. Маштоца 25',
      about: 'Современный медицинский центр с полным спектром услуг',
    },
  });

  const clinicOwnerPasswordHash = await bcrypt.hash('Clinic123', 12);
  const clinicOwner = await prisma.user.create({
    data: {
      clinicId: clinic2.id,
      name: 'Gurgen Ginosyan',
      email: 'clinic@test.am',
      passwordHash: clinicOwnerPasswordHash,
      role: 'CLINIC',
      status: 'ACTIVE',
      phone: '+374 41 881822',
    },
  });

  console.log('✅ Test CLINIC user created:', clinicOwner.email);

  // 7. Создаем тестового ADMIN для системы
  const systemAdminPasswordHash = await bcrypt.hash('Admin123', 12);
  const systemAdmin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@system.am',
      passwordHash: systemAdminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ System ADMIN created:', systemAdmin.email);

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Test credentials:');
  console.log('   🏥 CLINIC:  clinic@test.am / Clinic123');
  console.log('   🔑 ADMIN:   admin@system.am / Admin123');
  console.log('   👨‍⚕️ Admin (old): admin@dentalux.am / Admin123!');
  console.log('   ⚕️ Doctor: karen@dentalux.am / Doctor123!');
  console.log('');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

