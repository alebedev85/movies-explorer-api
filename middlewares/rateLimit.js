const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10000,
  max: 100,
  message: 'В настоящий момент превышено количество запросов на сервер. Пожалуйста, попробуйте повторить позже',
});

module.exports = {
  limiter,
};
