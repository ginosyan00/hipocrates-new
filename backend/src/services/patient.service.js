import { prisma } from '../config/database.js';

/**
 * Patient Service
 * Бизнес-логика для работы с пациентами
 */

/**
 * Получить всех пациентов клиники
 * @param {string} clinicId - ID клиники
 * @param {object} options - Опции (search, page, limit)
 * @returns {Promise<object>} { patients, meta }
 */
export async function findAll(clinicId, options = {}) {
  const { search, page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  // Построение where clause
  const where = {
    clinicId, // ВСЕГДА фильтруем по clinicId!
  };

  // Поиск по имени или телефону (SQLite не поддерживает mode: 'insensitive')
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }

  // Получаем пациентов и общее количество
  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.patient.count({ where }),
  ]);

  return {
    patients,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Получить пациента по ID
 * @param {string} clinicId - ID клиники
 * @param {string} patientId - ID пациента
 * @returns {Promise<object>} Patient
 */
export async function findById(clinicId, patientId) {
  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
      clinicId, // ОБЯЗАТЕЛЬНО!
    },
    include: {
      appointments: {
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
        },
        orderBy: { appointmentDate: 'desc' },
        take: 10, // Последние 10 приёмов
      },
    },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  return patient;
}

/**
 * Найти пациента по телефону в рамках клиники
 * @param {string} clinicId - ID клиники
 * @param {string} phone - Телефон
 * @returns {Promise<object|null>} Patient или null
 */
export async function findByPhone(clinicId, phone) {
  return await prisma.patient.findFirst({
    where: {
      clinicId,
      phone,
    },
  });
}

/**
 * Найти пациента по email или phone (для PATIENT users)
 * @param {string} email - Email пользователя
 * @param {string} phone - Телефон пользователя (опционально)
 * @returns {Promise<object|null>} Patient или null
 */
export async function findByUserEmail(email, phone = null) {
  const where = {};
  
  if (email) {
    where.email = email;
  }
  
  if (phone) {
    where.OR = [
      { email: email || undefined },
      { phone: phone },
    ];
  } else if (email) {
    where.email = email;
  }

  const patient = await prisma.patient.findFirst({
    where,
    include: {
      clinic: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          address: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return patient;
}

/**
 * Получить все appointments для пациента по email
 * @param {string} email - Email пользователя
 * @param {object} options - Опции (status, page, limit)
 * @returns {Promise<object>} { appointments, meta }
 */
export async function getPatientAppointments(email, options = {}) {
  const { status, page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  // Находим пациента по email
  const patient = await findByUserEmail(email);
  
  if (!patient) {
    return {
      appointments: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  // Построение where clause для appointments
  const where = {
    patientId: patient.id,
  };

  if (status) {
    where.status = status;
  }

  // Получаем appointments и общее количество
  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            phone: true,
          },
        },
        clinic: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            address: true,
            phone: true,
          },
        },
      },
      orderBy: { appointmentDate: 'desc' },
      take: limit,
      skip,
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    appointments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Создать пациента
 * @param {string} clinicId - ID клиники
 * @param {object} data - Данные пациента
 * @returns {Promise<object>} Созданный пациент
 */
export async function create(clinicId, data) {
  const patient = await prisma.patient.create({
    data: {
      clinicId, // ОБЯЗАТЕЛЬНО!
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender || null,
      notes: data.notes || null,
    },
  });

  return patient;
}

/**
 * Обновить пациента
 * @param {string} clinicId - ID клиники
 * @param {string} patientId - ID пациента
 * @param {object} data - Данные для обновления
 * @returns {Promise<object>} Обновленный пациент
 */
export async function update(clinicId, patientId, data) {
  // Проверяем что пациент существует
  await findById(clinicId, patientId);

  // Обновляем
  const updated = await prisma.patient.update({
    where: { id: patientId },
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      notes: data.notes,
    },
  });

  return updated;
}

/**
 * Удалить пациента
 * @param {string} clinicId - ID клиники
 * @param {string} patientId - ID пациента
 */
export async function remove(clinicId, patientId) {
  // Проверяем что пациент существует
  await findById(clinicId, patientId);

  // Удаляем
  await prisma.patient.delete({
    where: { id: patientId },
  });
}
