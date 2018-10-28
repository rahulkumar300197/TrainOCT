var express = require('express');
var userValidator = require('./validator/userValidator');
var userControler = require('./controler/userControler');
var router = express.Router();


router.post('/signup',userValidator.userSignup, userControler.userSignup);
router.post('/login',userValidator.userLogin, userControler.userLogin);
router.post('/logout',userValidator.userLogout, userControler.userLogout);
router.post('/accessTokenLogin',userValidator.accessTokenLogin, userControler.accessTokenLogin);
router.post('/getAllMessages',userValidator.getAllMessages, userControler.getAllMessages);
router.post('/getAllUsers',userValidator.getAllUsers, userControler.getAllUsers);
router.get('/index',userControler.getIndex);
router.get('/login/page',userControler.getLoginPage);
router.get('/signup/page',userControler.getSignupPage);
router.get('/error/page',userControler.getErrorPage);

module.exports = router;
