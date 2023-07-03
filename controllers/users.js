const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const jwt = require('../utils/jwt');
const usersModel = require('../models/user');

// Errors
const BadEmailError = require('../errors/bad-email-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-error');
const BadRequestError = require('../errors/bad-request-err');

const getUsers = (req, res, next) => {
  usersModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  usersModel.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

const getMyUser = (req, res, next) => {
  usersModel.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

/**
 *Функция регистрации нового пользователя, принимет данные пользователя,
  хеширует и сохраняет хешированный пароль
 * @param {*} req
 * @param {*} res
 * @returns оюъект с токеном токен
 */
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => usersModel.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new BadEmailError('Такой email уже используется'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

const edithUser = (req, res, next) => {
  usersModel.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

const editAvatarhUser = (req, res, next) => {
  usersModel.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

/**
 *Функция авторизации, принимает email и пороль,
  ищет пользователя по email, проверяет пороль и генерирует токен
 * @param {*} req
 * @param {*} res
 * @returns оюъект с токеном токен
 */
const login = (req, res, next) => {
  const { email, password } = req.body;

  usersModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.signToken({ _id: user._id });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getMyUser,
  getUserById,
  createUser,
  edithUser,
  editAvatarhUser,
  login,
};
