const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { SECRET } = require('../utils/config');

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  var last_login = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');


  const user = await User.findOne({
    username: { $regex: new RegExp('^' + username + '$', 'i') },
  });

  if (!user) {
    return res
      .status(400)
      .send({ message: 'No account with this username has been registered.' });
  }

  if (user.is_banned) {
    return res
      .status(400)
      .send({ message: 'You have been banned. Please sign up with other username.' })
  }

  const credentialsValid = await bcrypt.compare(password, user.passwordHash);

  if (!credentialsValid) {
    return res.status(401).send({ message: 'Invalid username or password.' });
  }

  const payloadForToken = {
    id: user._id,
  };

  user.last_login = last_login;
  user.is_logined = true;
    
  await user.save();

  const token = jwt.sign(payloadForToken, SECRET);

  res.status(200).json({
    token,
    username: user.username,
    id: user._id,
    avatar: user.avatar,
    userrole: user.userRole, 
    ip_address: user.ip_address, 
    readposts: user.readPosts, 
    notifications: user.notifications, 
    karma: user.karmaPoints.postKarma + user.karmaPoints.commentKarma,
  });
};

const logoutUser = async (req, res) => {
  const { id } = req.body;
  
  const user = await User.findById(id);

  if (!user) {
    return;
  }

  user.is_logined = false;
    
  await user.save();

  res.status(204).end();
};

const signupUser = async (req, res) => {
  const { username, password } = req.body;
  const { userIp: ip_address } = req;

  if (!password || password.length < 8) {
    return res
      .status(400)
      .send({ message: 'Password needs to be atleast 8 characters long.' });
  }

  if (!username || username.length > 20 || username.length < 3) {
    return res
      .status(400)
      .send({ message: 'Username character length must be in range of 3-20.' });
  }

  const userCountWithIp = await User.find({ ip_address: ip_address }).countDocuments();

  if(userCountWithIp >= 4) {
    return res
      .status(400)
      .send({ message: 'Your ip_address is used by more than 4 users. You cannot sign up with this ip_address' });
  }

  const existingUser = await User.findOne({
    username: { $regex: new RegExp('^' + username + '$', 'i') },
  });

  if (existingUser) {
    return res.status(400).send({
      message: `Username '${username}' is already taken. Choose another one.`,
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  var last_login = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  var date_created = last_login;
  var last_updated = last_login;
  var is_logined = true;

  const user = new User({
    username,
    passwordHash,
    ip_address, 
    is_logined, 
    date_created, 
    last_updated, 
    last_login, 
  });

  const savedUser = await user.save();

  const payloadForToken = {
    id: savedUser._id,
  };

  const token = jwt.sign(payloadForToken, SECRET);

  res.status(200).json({
    token,
    username: savedUser.username,
    id: savedUser._id,
    ip_address: savedUser.ip_address,
    userrole: savedUser.userRole, 
    avatar: savedUser.avatar,
    karma: 0,
  });
};

module.exports = { loginUser, signupUser, logoutUser };
