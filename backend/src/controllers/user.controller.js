import * as userService from '../services/user.service.js';
import { successResponse } from '../utils/response.util.js';

/**
 * User Controller
 * Обработчики для user endpoints
 */

/**
 * GET /api/v1/users
 * Получить список пользователей
 */
export async function getAll(req, res, next) {
  try {
    const { role, page, limit } = req.query;
    const clinicId = req.user.clinicId;

    const result = await userService.findAll(clinicId, {
      role,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });

    successResponse(res, result, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/users/doctors
 * Получить список врачей
 */
export async function getDoctors(req, res, next) {
  try {
    const clinicId = req.user.clinicId;

    const doctors = await userService.findDoctors(clinicId);

    successResponse(res, doctors, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/users/:id
 * Получить пользователя по ID
 */
export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const clinicId = req.user.clinicId;

    const user = await userService.findById(clinicId, id);

    successResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/users
 * Создать нового пользователя
 */
export async function create(req, res, next) {
  try {
    const clinicId = req.user.clinicId;

    const user = await userService.create(clinicId, req.body);

    successResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/users/:id
 * Обновить пользователя
 */
export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const clinicId = req.user.clinicId;

    const user = await userService.update(clinicId, id, req.body);

    successResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/users/:id
 * Удалить пользователя
 */
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const clinicId = req.user.clinicId;

    await userService.remove(clinicId, id);

    successResponse(res, { message: 'User deleted successfully' }, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/users/pending
 * Получить всех пользователей со статусом PENDING (только для ADMIN)
 */
export async function getPendingUsers(req, res, next) {
  try {
    console.log('🔵 [USER CONTROLLER] Запрос pending пользователей');

    const users = await userService.findPendingUsers();

    successResponse(res, users, 200);
  } catch (error) {
    console.log('🔴 [USER CONTROLLER] Ошибка:', error.message);
    next(error);
  }
}

/**
 * POST /api/v1/users/:id/approve
 * Одобрить пользователя (PENDING -> ACTIVE) (только для ADMIN)
 */
export async function approveUser(req, res, next) {
  try {
    const { id } = req.params;

    console.log('🔵 [USER CONTROLLER] Одобрение пользователя:', id);

    const user = await userService.approveUser(id);

    successResponse(res, user, 200);
  } catch (error) {
    console.log('🔴 [USER CONTROLLER] Ошибка:', error.message);
    next(error);
  }
}

/**
 * POST /api/v1/users/:id/reject
 * Отклонить пользователя (PENDING -> REJECTED) (только для ADMIN)
 */
export async function rejectUser(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log('🔵 [USER CONTROLLER] Отклонение пользователя:', id);

    const user = await userService.rejectUser(id, reason);

    successResponse(res, user, 200);
  } catch (error) {
    console.log('🔴 [USER CONTROLLER] Ошибка:', error.message);
    next(error);
  }
}

/**
 * POST /api/v1/users/doctors
 * Создать врача в клинике (только для CLINIC role - владелец клиники)
 */
export async function createDoctor(req, res, next) {
  try {
    const clinicId = req.user.clinicId;

    console.log('🔵 [USER CONTROLLER] Создание врача для клиники:', clinicId);

    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const doctor = await userService.createDoctorByClinic(clinicId, req.body);

    console.log('✅ [USER CONTROLLER] Врач успешно создан:', doctor.id);
    successResponse(res, doctor, 201);
  } catch (error) {
    console.log('🔴 [USER CONTROLLER] Ошибка:', error.message);
    next(error);
  }
}

