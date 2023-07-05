const UnauthorizedError = require('../errors/unauthorized-error');
const jwt = require('../utils/jwt');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // проверяем, есть ли токен в заголовке
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Ошибка авторизации'));
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.checkToken(token);
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Ошибка авторизации'));
  }

  req.user = payload;

  return next();
};
