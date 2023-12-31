const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateUserBody, validateLoginBody } = require('../middlewares/validate');
const NotFoundError = require('../errors/not-found-err');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { login, createUser } = require('../controllers/users');

router.post('/signup', validateUserBody, createUser);

router.post('/signin', validateLoginBody, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
