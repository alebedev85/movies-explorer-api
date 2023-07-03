const { default: mongoose } = require('mongoose');
const cardsModel = require('../models/movie');

const HaveNoRightError = require('../errors/have-no-right');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getMovies = (req, res, next) => {
  cardsModel.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const saveMovie = (req, res, next) => {
  cardsModel.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((users) => {
      res.status(201).send(users);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  cardsModel.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Такой карточки не существует');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new HaveNoRightError('Вы не можете удалить чужую карточку');
      }
      card.deleteOne()
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
};
