var express = require('express');
var userValidator = require('./validator/userValidator');
var userControler = require('./controler/userControler');
var router = express.Router();


router.post('/login',userValidator.userLogin, userControler.userLogin);
router.post('/signup',userValidator.userSignup, userControler.userSignup);

module.exports = router;
