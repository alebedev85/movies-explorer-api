const router = require('express').Router();
const { validateEditUserInfo } = require('../middlewares/validate');
const userController = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/', userController.getUsers);

// возвращает информацию о пользователе (email и имя)
router.get('/me', userController.getMyUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', validateEditUserInfo, userController.edithUser);

module.exports = router;
