const router = require('express').Router();
const moviesController = require('../controllers/movies');
const { validateMovieBody, validationMovieId } = require('../middlewares/validate');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', moviesController.getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
router.post('/', validateMovieBody, moviesController.saveMovie);

// удаляет фильм по id
router.delete('/:movieId', validationMovieId, moviesController.deleteMovie);

module.exports = router;
