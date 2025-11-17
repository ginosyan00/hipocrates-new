/**
 * Tenant Middleware
 * Multi-tenancy isolation - автоматическая фильтрация по clinicId
 */
export function tenantMiddleware(req, res, next) {
  // Проверяем что пользователь авторизован
  if (!req.user || !req.user.clinicId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'User not authenticated or clinicId missing',
      },
    });
  }

  // Добавляем tenant фильтр в request
  // Этот фильтр будет использоваться в services для автоматической фильтрации
  req.tenantFilter = {
    clinicId: req.user.clinicId,
  };

  // Логирование для отладки (в development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[TENANT]', {
      userId: req.user.userId,
      clinicId: req.user.clinicId,
      role: req.user.role,
      path: req.path,
      method: req.method,
    });
  }

  next();
}

