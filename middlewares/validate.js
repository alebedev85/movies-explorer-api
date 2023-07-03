const { celebrate, Joi } = require('celebrate');
const { regexHttp, regexEmail } = require('../utils/constants');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regexEmail),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexHttp),
  }),
});

const validateEditUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateEditUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regexHttp),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexHttp),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().hex()
      .length(24),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().hex()
      .length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateCardBody,
  validateEditUserInfo,
  validateEditUserAvatar,
  validationUserId,
  validationCardId,
};
