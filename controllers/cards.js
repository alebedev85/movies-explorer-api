const { default: mongoose } = require('mongoose');
const cardsModel = require('../models/movie');

const HaveNoRightError = require('../errors/have-no-right');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getCards = (req, res, next) => {
  cardsModel.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const creatCard = (req, res, next) => {
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

const deleteCard = (req, res, next) => {
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

const likeCard = (req, res, next) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => {
    throw new NotFoundError('Такой карточки не существует');
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => {
    throw new NotFoundError('Такой карточки не существует');
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  creatCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
