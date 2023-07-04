const {Router} = require('express');
const bodyParser = require("body-parser");
const authController = require('../Controllers/authController')
const urlencodedParser = bodyParser.urlencoded({ extended: true });
// app.use(urlencodedParser);


const router = Router();

router.post('/signup',urlencodedParser,authController.signup_post);

router.post('/signin',urlencodedParser,authController.signin_post);
router.post('/forgot',urlencodedParser,authController.forgot_post);


module.exports =router;