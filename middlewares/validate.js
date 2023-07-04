const { celebrate, Joi } = require('celebrate');
const { regexHttp, regexEmail } = require('../utils/constants');

// вылидация создания нового пользователя
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().required().pattern(regexEmail),
  }),
});

// вылидация логирования пользователя
const validateLoginBody = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().pattern(regexEmail),
  }),
});

// вылидация редактирования пользователя
const validateEditUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(regexEmail),
  }),
});

// вылидация добавления нового фильма
const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexHttp),
    trailerLink: Joi.string().required().pattern(regexHttp),
    thumbnail: Joi.string().required().pattern(regexHttp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// валидация id фильма
const validationMovieId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().hex()
      .length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateMovieBody,
  validateEditUserInfo,
  validationMovieId,
  validateLoginBody,
};
