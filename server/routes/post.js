const express = require('express');
const { auth } = require('../utils/middleware');
const {
  getPosts,
  getDeletedPosts, 
  getPinPosts, 
  getSearchedPosts,
  getPostAndComments,
  createNewPost,
  updatePost,
  deletePost,
  realDeletePost, 
} = require('../controllers/post');
const { upvotePost, downvotePost } = require('../controllers/postVote');
const {
  postComment,
  postAward, 
  deleteComment,
  realDeleteComment, 
  deleteAward, 
  updateComment,
  postReply,
  deleteReply,
  updateReply,
  uploadImage, 
} = require('../controllers/postComment');
const {
  upvoteComment,
  downvoteComment,
  upvoteReply,
  downvoteReply,
} = require('../controllers/commentVote');

const router = express.Router();

//CRUD posts routes
router.get('/', getPosts);
router.get('/delete', getDeletedPosts);
router.get('/pin', getPinPosts);
router.get('/search', getSearchedPosts);
router.get('/:id/comments', getPostAndComments);
// router.get('/subscribed', auth, getSubscribedPosts);
router.post('/', auth, createNewPost);
router.patch('/:id', auth, updatePost);
router.delete('/delete/:id', auth, deletePost);
router.delete('/realdelete/:id', auth, realDeletePost);
router.post('/upload', uploadImage);

//posts vote routes
router.post('/:id/upvote', auth, upvotePost);
router.post('/:id/downvote', auth, downvotePost);

//post comments routes
router.post('/:id/comment', auth, postComment);
router.post('/:id/award', auth, postAward);
router.delete('/:id/comment/:commentId', auth, deleteComment);
router.delete('/:id/real/comment/:commentId', auth, realDeleteComment);
router.delete('/:id/award/:awardId', auth, deleteAward);
router.patch('/:id/comment/:commentId', auth, updateComment);
router.post('/:id/comment/:commentId/reply', auth, postReply);
router.delete('/:id/comment/:commentId/reply/:replyId', auth, deleteReply);
router.patch('/:id/comment/:commentId/reply/:replyId', auth, updateReply);

//comment vote routes
router.post('/:id/comment/:commentId/upvote', auth, upvoteComment);
router.post('/:id/comment/:commentId/downvote', auth, downvoteComment);
router.post('/:id/comment/:commentId/reply/:replyId/upvote', auth, upvoteReply);
router.post(
  '/:id/comment/:commentId/reply/:replyId/downvote',
  auth,
  downvoteReply
);

module.exports = router;
