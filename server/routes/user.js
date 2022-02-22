const express = require('express');
const { auth } = require('../utils/middleware');
const withIp = require('../middleware/withIp');
const recaptchaHelpers = require('../helpers/recaptcha');

const {
  getAllUsers, 
  getUser,
  getBanState, 
  removeNotif, 
  setUserAvatar,
  setUserReadPost, 
  removeUserAvatar,
  updateUser, 
  createUser, 
  deleteUser, 
} = require('../controllers/user');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:username', getUser);
router.get('/ban/:id', getBanState);
router.post('/removenotif', removeNotif);
router.post('/avatar', auth, setUserAvatar);
router.post('/reads', auth, setUserReadPost);
router.post('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.post('/create', withIp, createUser);
router.delete('/avatar', auth, removeUserAvatar);

router.post('/verify', (req, res, next) => {
  const {data} =  req.body;
  console.log(data);
  const recaptchaData = {
    remoteip: req.connection.remoteAddress,
    response: data,
    secret: process.env.RECAPTCHA_SECRET_KEY,
  };

  return recaptchaHelpers.verifyRecaptcha(recaptchaData)
    .then(() => {
      // Process the request
      console.log('recaptcha success', recaptchaData);
      // return true;
      res.status(201).json({ captchaVerify: true });
    });
});

module.exports = router;
