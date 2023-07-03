const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateUserBody } = require('../middlewares/validate');
const NotFoundError = require('../errors/not-found-err');

const userRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');

router.post('/signup', validateUserBody, createUser);

router.post('/signin', validateUserBody, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
