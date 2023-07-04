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
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    thumbnail: req.body.thumbnail,
    owner: req.user._id,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Введены некорректные данные', err));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  cardsModel.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Такакого фильма нет в вашем списке');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new HaveNoRightError('Вы не можете удалить чужой фильм');
      }
      movie.deleteOne()
        .then(() => res.send({ message: 'Фильм удалён' }))
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
