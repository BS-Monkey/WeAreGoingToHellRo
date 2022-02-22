const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Post = require('../models/post');
const { SECRET } = require('../utils/config');
const { cloudinary, UPLOAD_PRESET } = require('../utils/config');
const paginateResults = require('../utils/paginateResults');

const getAllUsers = async (_req, res) => {
  const allUsers = await User.find({});
  res.status(200).json(allUsers);
};

const getUser = async (req, res) => {
  const { username } = req.params;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const user = await User.findOne({
    username: { $regex: new RegExp('^' + username + '$', 'i') },
  });

  if (!user) {
    return res
      .status(404)
      .send({ message: `Username '${username}' does not exist on server.` });
  }

  const postsCount = await Post.find({ author: user.id, is_deleted: false }).countDocuments();
  const paginated = paginateResults(page, limit, postsCount);
  const userPosts = await Post.find({ author: user.id, is_deleted: false })
    .sort({ createdAt: -1 })
    .select('-comments')
    .limit(limit)
    .skip(paginated.startIndex)
    .populate('author', 'username');

  const paginatedPosts = {
    previous: paginated.results.previous,
    results: userPosts,
    next: paginated.results.next,
  };

  res.status(200).json({ userDetails: user, posts: paginatedPosts });
};

const setUserAvatar = async (req, res) => {
  const { avatarImage } = req.body;

  if (!avatarImage) {
    return res
      .status(400)
      .send({ message: 'Image URL needed for setting avatar.' });
  }

  const user = await User.findById(req.user);

  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  const uploadedImage = await cloudinary.uploader.upload(
    avatarImage,
    {
      upload_preset: UPLOAD_PRESET,
    },
    (error) => {
      if (error) return res.status(401).send({ message: error.message });
    }
  );

  var last_updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  user.last_updated = last_updated;
  user.avatar = {
    exists: true,
    imageLink: uploadedImage.url,
    imageId: uploadedImage.public_id,
  };

  const savedUser = await user.save();
  res.status(201).json({ avatar: savedUser.avatar });
};

const removeNotif = async (req, res) => {
  console.log('notif', req.body);
  const user_id = req.body.user_id;
  const notif_id = req.body.notif_id;

  const user = await User.findById(user_id);
  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  user.notifications = user.notifications.filter((n) => n._id.toString() !== notif_id);
  await user.save();

  res.status(201).json({notifications: user.notifications});
}

const removeUserAvatar = async (req, res) => {
  const user = await User.findById(req.user);

  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  var last_updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  user.last_updated = last_updated;
  user.avatar = {
    exists: false,
    imageLink: 'null',
    imageId: 'null',
  };

  await user.save();
  res.status(204).end();
};

const updateUser = async (req, res) => {
  const {id} = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }
  
  var last_updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  user.is_logined = req.body.login_state;
  user.is_banned = req.body.ban_state;
  user.userRole = req.body.role;
  user.last_updated = last_updated;
    
  await user.save();
  // res.status(200).json(user);
  res.status(204).end();
}

const createUser = async (req, res) => {
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
  var is_logined = false;

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

  // res.status(200).json({
  //   token,
  //   username: savedUser.username,
  //   id: savedUser._id,
  //   ip_address: savedUser.ip_address,
  //   userrole: savedUser.userRole, 
  //   avatar: savedUser.avatar,
  //   karma: 0,
  // });
  res.status(204).end();
};

const getBanState = async (req, res) => {
  const {id} = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  res.status(201).json({ ban_state: user.is_banned, ban_user: user.username });
};

const setUserReadPost = async (req, res) => {
  const {id} = req.body;

  console.log('post_id', id);

  const post = await Post.findById(id);
  const user = await User.findById(req.user);


  if (!post) {
    return res.status(404).send({
      message: `Post with ID: ${id} does not exist in database.`,
    });
  }

  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  const targetPost = user.readPosts.find(
    (c) => c._id.toString() === id
  );

  if (targetPost) {
    user.notifications = user.notifications.filter((n) => n.url_link !== id);
    await user.save();
    return res.status(201).json({ readposts: user.readPosts });
  }
  
  user.readPosts = user.readPosts.concat(id);
  user.notifications = user.notifications.filter((n) => n.url_link !== id);
  await user.save();

  res.status(201).json({ readposts: user.readPosts });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).send({
      message: `User with ID: ${id} does not exist in database.`,
    });
  }

  await User.findByIdAndDelete(id);

  res.status(204).end();
};

module.exports = { getUser, getAllUsers, getBanState, removeNotif, setUserAvatar, setUserReadPost, removeUserAvatar, updateUser, createUser, deleteUser };
