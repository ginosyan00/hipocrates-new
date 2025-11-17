import * as publicService from '../services/public.service.js';
import { successResponse } from '../utils/response.util.js';

/**
 * Public Controller
 * Обработчики для публичных endpoints (без авторизации)
 */

/**
 * GET /api/v1/public/clinics
 * Получить список клиник
 */
export async function getClinics(req, res, next) {
  try {
    const { city, page, limit } = req.query;

    const result = await publicService.findAllClinics({
      city,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });

    successResponse(res, result, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/public/clinics/:slug
 * Получить детали клиники по slug
 */
export async function getClinicBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const clinic = await publicService.findClinicBySlug(slug);

    successResponse(res, clinic, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/public/clinics/:slug/doctors
 * Получить врачей клиники
 */
export async function getClinicDoctors(req, res, next) {
  try {
    const { slug } = req.params;

    const doctors = await publicService.findClinicDoctors(slug);

    successResponse(res, doctors, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/public/appointments
 * Создать публичную заявку на приём
 */
export async function createAppointment(req, res, next) {
  try {
    const { clinicSlug, doctorId, patient, appointmentDate, reason, registeredAt } = req.body;

    // Преобразуем registeredAt в Date, если он передан как строка
    const registeredAtDate = registeredAt ? new Date(registeredAt) : null;

    const result = await publicService.createPublicAppointment(
      clinicSlug,
      doctorId,
      patient,
      appointmentDate,
      reason,
      registeredAtDate
    );

    successResponse(res, result, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/public/cities
 * Получить список городов
 */
export async function getCities(req, res, next) {
  try {
    const cities = await publicService.getUniqueCities();

    successResponse(res, cities, 200);
  } catch (error) {
    next(error);
  }
}


