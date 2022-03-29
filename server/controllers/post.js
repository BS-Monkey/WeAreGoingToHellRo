const Post = require('../models/post');
const User = require('../models/user');
const postTypeValidator = require('../utils/postTypeValidator');
const { cloudinary, UPLOAD_PRESET } = require('../utils/config');
const paginateResults = require('../utils/paginateResults');

// const { getIO } = require('../io');
// const path = require("path");
// const randomString = require('random-string');
// function getFileName(prefix, filename) {
//   var ext = path.extname(filename)
//   var newFileName = randomString({
//     length: 8,
//     numeric: true,
//     letters: true,
//     special: false
//   });
//   newFileName += ext;
//   return prefix + newFileName;
// }

const getPosts = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const sortBy = req.query.sortby;
  const flairBy = Number(req.query.flairBy);

  let sortQuery;
  switch (sortBy) {
    case 'new':
      sortQuery = { createdAt: -1 };
      break;
    case 'top':
      sortQuery = { pointsCount: -1 };
      break;
    case 'best':
      sortQuery = { voteRatio: -1 };
      break;
    case 'hot':
      sortQuery = { hotAlgo: -1 };
      break;
    case 'controversial':
      sortQuery = { controversialAlgo: -1 };
      break;
    case 'old':
      sortQuery = { createdAt: 1 };
      break;
    default:
      sortQuery = {};
  }
  
  const postsCount = await Post.find({is_deleted: false}).countDocuments();
  const paginated = paginateResults(page, limit, postsCount);

  let allPosts;
  if(flairBy === 0) {
    allPosts = await Post.find({is_pinned: false, is_deleted: false})
      .sort(sortQuery)
      .select('-comments')
      .limit(limit)
      .skip(paginated.startIndex)
      .populate('author', 'username')
  } else {
    allPosts = await Post.find({flairSubmission: flairBy, is_pinned: false, is_deleted: false})
      .sort(sortQuery)
      .select('-comments')
      .limit(limit)
      .skip(paginated.startIndex)
      .populate('author', 'username')
  }

  // console.log('all Posts', allPosts);

  const paginatedPosts = {
    previous: paginated.results.previous,
    results: allPosts,
    next: paginated.results.next,
  };

  res.status(200).json(paginatedPosts);
};

const getDeletedPosts = async (req, res) => {
  const allPosts = await Post.find({is_deleted: true})
      .populate('author', 'username')

  res.status(200).json(allPosts);
};

const getPinPosts = async (req, res) => {
  const allPosts = await Post.find({is_pinned: true, is_deleted: false})
    .select('-comments')
    .populate('author', 'username')
  
  res.status(200).json(allPosts);
};

const getSearchedPosts = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const query = req.query.query;

  const findQuery = {
    $or: [
      {
        title: {
          $regex: query,
          $options: 'i',
        },
      },
      {
        textSubmission: {
          $regex: query,
          $options: 'i',
        },
      },
    ],
  };

  const postsCount = await Post.find(findQuery).countDocuments();
  const paginated = paginateResults(page, limit, postsCount);
  const searchedPosts = await Post.find(findQuery)
    .sort({ hotAlgo: -1 })
    .select('-comments')
    .limit(limit)
    .skip(paginated.startIndex)
    .populate('author', 'username');

  const paginatedPosts = {
    previous: paginated.results.previous,
    results: searchedPosts,
    next: paginated.results.next,
  };

  res.status(200).json(paginatedPosts);
};

const getPostAndComments = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    return res
      .status(404)
      .send({ message: `Post with ID: '${id}' does not exist in database.` });
  }

  const populatedPost = await post
    .populate('author', 'username')
    .populate('comments.commentedBy', 'username')
    .populate('comments.replies.repliedBy', 'username')
    .execPopulate();

  res.status(200).json(populatedPost);
};

const createNewPost = async (req, res) => {
  console.log(req.body)
  const {
    title,
    postType,
    textSubmission,
    linkSubmission,
    imageSubmission,
    videoSubmission, 
    flairSubmission, 
    is_pinned, 
    is_locked, 
  } = req.body;

  const validatedFields = postTypeValidator(
    postType,
    textSubmission,
    linkSubmission,
    imageSubmission, 
    videoSubmission, 
  );

  const author = await User.findById(req.user);

  if (!author) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  // if(author.userRole >= 3) {
  //   return res
  //     .status(404)
  //     .send({ message: 'You cannot pin or lock this post.' });
  // }

  const newPost = new Post({
    title,
    author: author._id,
    upvotedBy: [author._id],
    pointsCount: 1,
    flairSubmission: flairSubmission, 
    is_pinned: is_pinned, 
    is_locked: is_locked, 
    is_deleted: false, 
    ...validatedFields,
  });

  if (postType === 'Image') {
    const uploadedImage = await cloudinary.uploader.upload(
      imageSubmission,
      {
        upload_preset: UPLOAD_PRESET,
        resource_type: 'image', 
        chunk_size: 4000000, 
      },
      (error) => {
        if (error) return res.status(401).send({ message: error.message });
      }
    );

    newPost.imageSubmission = {
      imageLink: uploadedImage.url,
      imageId: uploadedImage.public_id,
    };
  }

  if (postType === 'Video') {
    const uploadedVideo = await cloudinary.uploader.upload_large(
      videoSubmission, 
      {
        resource_type: "auto", 
        format: 'mp4',
        chunk_size: 25000000,
        upload_preset: UPLOAD_PRESET,
      },
      (error) => {
        console.log(error)
      }
    );

    newPost.videoSubmission = {
      videoLink: uploadedVideo.url,
      videoId: uploadedVideo.public_id,
    };
  }

  const savedPost = await newPost.save();

  author.posts = author.posts.concat(savedPost._id);
  author.karmaPoints.postKarma++;
  await author.save();

  const populatedPost = await savedPost
    .populate('author', 'username')
    .execPopulate();

  res.status(202).json(populatedPost);
};

const updatePost = async (req, res) => {
  const { id } = req.params;

  const { textSubmission, linkSubmission, imageSubmission, videoSubmission, flairSubmission, is_pinned, is_locked } = req.body;

  const post = await Post.findById(id);
  const author = await User.findById(req.user);

  if (!post) {
    return res.status(404).send({
      message: `Post with ID: ${id} does not exist in database.`,
    });
  }

  if (!author) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  if (author.userRole >= 3 &&  post.author.toString() !== author._id.toString()) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  const validatedFields = postTypeValidator(
    post.postType,
    textSubmission,
    linkSubmission,
    imageSubmission, 
    videoSubmission, 
  );

  switch (post.postType) {
    case 'Text':
      post.textSubmission = validatedFields.textSubmission;
      break;

    case 'Link':
      post.linkSubmission = validatedFields.linkSubmission;
      break;

    case 'Image': {
      const uploadedImage = await cloudinary.uploader.upload(
        imageSubmission,
        {
          upload_preset: UPLOAD_PRESET,
        },
        (error) => {
          if (error) return res.status(401).send({ message: error.message });
        }
      );

      post.imageSubmission = {
        imageLink: uploadedImage.url,
        imageId: uploadedImage.public_id,
      };
      break;
    }

    case 'Video' : {
      const uploadedImage = await cloudinary.uploader.upload(
        videoSubmission,
        {
          upload_preset: UPLOAD_PRESET,
        },
        (error) => {
          if (error) return res.status(401).send({ message: error.message });
        }
      );

      post.videoSubmission = {
        videoLink: uploadedImage.url,
        videoId: uploadedImage.public_id,
      };
      break;
    }

    default:
      return res.status(403).send({ message: 'Invalid post type.' });
  }

  post.updatedAt = Date.now();
  post.flairSubmission = flairSubmission;
  post.is_pinned = is_pinned;
  post.is_locked = is_locked;

  const savedPost = await post.save();
  const populatedPost = await savedPost
    .populate('author', 'username')
    .populate('comments.commentedBy', 'username')
    .populate('comments.replies.repliedBy', 'username')
    .execPopulate();

  res.status(202).json(populatedPost);
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  const author = await User.findById(req.user);

  if (!post) {
    return res.status(404).send({
      message: `Post with ID: ${id} does not exist in database.`,
    });
  }

  if (!author) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  if (author.userRole >= 3 && post.author.toString() !== author._id.toString()) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  post.is_deleted = true;
  await post.save();

  author.posts = author.posts.filter((p) => p.toString() !== id);
  await author.save();

  res.status(204).end();
};

const realDeletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  const author = await User.findById(req.user);

  if (!post) {
    return res.status(404).send({
      message: `Post with ID: ${id} does not exist in database.`,
    });
  }

  if (!author) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  if (author.userRole >= 3 && post.author.toString() !== author._id.toString()) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  await Post.findByIdAndDelete(id);

  author.posts = author.posts.filter((p) => p.toString() !== id);
  await author.save();

  res.status(204).end();
};

module.exports = {
  getPosts,
  getDeletedPosts, 
  getPinPosts, 
  getSearchedPosts,
  getPostAndComments,
  createNewPost,
  updatePost,
  deletePost,
  realDeletePost, 
};
