const router = require('express').Router();
const moviesController = require('../controllers/movies');
const { validateCardBody, validationCardId } = require('../middlewares/validate');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', moviesController.getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
router.post('/', validateCardBody, moviesController.saveMovie);

router.delete('/:_id/', validationCardId, moviesController.deleteMovie);

module.exports = router;
