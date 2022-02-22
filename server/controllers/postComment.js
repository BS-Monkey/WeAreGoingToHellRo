const Post = require('../models/post');
const User = require('../models/user');
const numOfComments = require('../utils/numOfComments');

const postComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).send({ message: `Comment body can't be empty.` });
  }

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

  post.comments = post.comments.concat({
    parentId: {parentType: 'Post', parentId: id}, 
    commentLvl: 0, 
    commentedBy: user._id,
    commentBody: comment,
    upvotedBy: [user._id],
    pointsCount: 1,
  });
  post.commentCount = (post.comments).length;
  const savedPost = await post.save();
  const populatedPost = await savedPost
    .populate('comments.commentedBy', 'username')
    .execPopulate();

  user.karmaPoints.commentKarma++;
  user.totalComments++;
  await user.save();

  const targetUser = await User.findById(post.author);
  if (targetUser) {    
    targetUser.notifications = targetUser.notifications.concat({
      title: 'comment to your post',
      content: `u/${user.username} leaved a comment to your post`,
      url_link: post._id,
    });
    await targetUser.save();
  }  

  const addedComment = populatedPost.comments[savedPost.comments.length - 1];
  res.status(201).json(addedComment);
};

const postAward = async (req, res) => {
  const { id } = req.params;
  const { award } = req.body;

  const post = await Post.findById(id);
  const user = await User.findById(req.user);

  if (award === 0) {
    return res.status(400).send({ message: `Award body can't be empty.` });
  }

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

  post.awards = post.awards.concat({
    awardedBy: user._id,
    awardedByName: user.username, 
    awardBody: award, 
  });

  const savedPost = await post.save();
  const populatedPost = await savedPost
    .populate('awards.awardedBy', 'username')
    .execPopulate();

  const addedAward = populatedPost.awards[savedPost.awards.length - 1];
  res.status(201).json(addedAward);
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

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

  const targetComment = post.comments.find(
    (c) => c._id.toString() === commentId
  );

  if (!targetComment) {
    return res.status(404).send({
      message: `Comment with ID: '${commentId}'  does not exist in database.`,
    });
  }

  if ((targetComment.commentedBy.toString() !== user._id.toString()) && user.userRole === 3) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  targetComment.is_deleted = true;

  post.comments = post.comments.map((c) =>
    c._id.toString() !== commentId ? c : targetComment
  );

  await post.save();
  res.status(200).json(post.comments);
};

const realDeleteComment = async (req, res) => {
  const { id, commentId } = req.params;

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

  const targetComment = post.comments.find(
    (c) => c._id.toString() === commentId
  );

  if (!targetComment) {
    return res.status(404).send({
      message: `Comment with ID: '${commentId}'  does not exist in database.`,
    });
  }

  if ((targetComment.commentedBy.toString() !== user._id.toString()) && user.userRole === 3) {
    return res.status(401).send({ message: 'Access is denied.' });
  }
  
  if (targetComment.childrenId.length !== 0) {
    targetComment.childrenId.map((childId) => (
      post.comments = post.comments.filter((c) => c._id.toString() !== childId)
    ));
  }

  const parentComment = post.comments.find((c) => c._id.toString() === targetComment.parentId.parentId);
  if (parentComment) {
    parentComment.childrenId = parentComment.childrenId.filter((c) => c._id.toString() !== commentId);
    await parentComment.save();
  }

  post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
  post.commentCount = (post.comments).length;

  await post.save();
  res.status(200).json(post.comments);
};

const deleteAward = async (req, res) => {
  const { id, awardId } = req.params;

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

  const targetAward = post.awards.find(
    (c) => c._id.toString() === awardId
  );

  if (!targetAward) {
    return res.status(404).send({
      message: `Award with ID: '${awardId}'  does not exist in database.`,
    });
  }
  
  if (targetAward.awardedBy.toString() !== user._id.toString() && user.userRole !== 1) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  post.awards = post.awards.filter((c) => c._id.toString() !== awardId);

  await post.save();
  res.status(204).end();
};

const updateComment = async (req, res) => {
  const { id, commentId } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).send({ message: `Comment body can't be empty.` });
  }

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

  const targetComment = post.comments.find(
    (c) => c._id.toString() === commentId
  );

  if (!targetComment) {
    return res.status(404).send({
      message: `Comment with ID: '${commentId}'  does not exist in database.`,
    });
  }

  if ((targetComment.commentedBy.toString() !== user._id.toString()) && (user.userRole === 3)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  targetComment.commentBody = comment;
  targetComment.updatedAt = Date.now();

  post.comments = post.comments.map((c) =>
    c._id.toString() !== commentId ? c : targetComment
  );

  await post.save();
  res.status(202).end();
};

const postReply = async (req, res) => {
  const { id, commentId } = req.params;
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).send({ message: `Reply body can't be empty.` });
  }

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

  const targetComment = post.comments.find(
    (c) => c._id.toString() === commentId
  );

  if (!targetComment) {
    return res.status(404).send({
      message: `Comment with ID: '${commentId}'  does not exist in database.`,
    });
  }

  post.comments = post.comments.concat({
    parentId: {parentType: 'Comment', parentId: commentId}, 
    commentLvl: targetComment.commentLvl + 1, 
    commentedBy: user._id,
    commentBody: reply,
    upvotedBy: [user._id],
    pointsCount: 1,
  });
  post.commentCount = (post.comments).length;
  const savedPost = await post.save();

  const populatedPost = await savedPost
    .populate('comments.commentedBy', 'username')
    .execPopulate();

  user.karmaPoints.commentKarma++;
  user.totalComments++;
  await user.save();

  const addedComment = populatedPost.comments[savedPost.comments.length - 1];
  targetComment.childrenId = targetComment.childrenId.concat(addedComment._id);

  post.comments = post.comments.map((c) =>
    c._id.toString() !== commentId ? c : targetComment
  );
  post.commentCount = (post.comments).length;

  await post.save();

  const targetUser = await User.findById(targetComment.commentedBy);
  if (targetUser) {    
    targetUser.notifications = targetUser.notifications.concat({
      title: 'reply to your comment',
      content: `u/${user.username} replied to your comment`,
      url_link: post._id,
    });
    await targetUser.save();
  }

  res.status(201).json(addedComment);
};

const deleteReply = async (req, res) => {
  const { id, commentId, replyId } = req.params;

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

  const targetComment = post.comments.find(
    (c) => c._id.toString() === commentId
  );

  if (!targetComment) {
    return res.status(404).send({
      message: `Comment with ID: '${commentId}'  does not exist in database.`,
    });
  }

  const targetReply = targetComment.replies.find(
    (r) => r._id.toString() === replyId
  );

  if (!targetReply) {
    return res.status(404).send({
      message: `Reply comment with ID: '${replyId}'  does not exist in database.`,
    });
  }

  if ((targetReply.repliedBy.toString() !== user._id.toString() && user.userRole === 3)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  targetComment.replies = targetComment.replies.filter(
    (r) => r._id.toString() !== replyId
  );

  post.comments = post.comments.map((c) =>
    c._id.toString() !== commentId ? c : targetComment
  );
  post.commentCount = (post.comments).length;

  await post.save();
  res.status(204).end();
};
const updateReply = async (req, res) => {
  const { id, commentId, replyId } = req.params;
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).send({ message: `Reply body can't be empty.` });
  }

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

  const targetComment = post.comments.find(
    (c) => c._id.toString() === commentId
  );

  if (!targetComment) {
    return res.status(404).send({
      message: `Comment with ID: '${commentId}'  does not exist in database.`,
    });
  }

  const targetReply = targetComment.replies.find(
    (r) => r._id.toString() === replyId
  );

  if (!targetReply) {
    return res.status(404).send({
      message: `Reply comment with ID: '${replyId}'  does not exist in database.`,
    });
  }

  if ((targetReply.repliedBy.toString() !== user._id.toString()) && user.userRole === 3) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  targetReply.replyBody = reply;
  targetReply.updatedAt = Date.now();

  targetComment.replies = targetComment.replies.map((r) =>
    r._id.toString() !== replyId ? r : targetReply
  );

  post.comments = post.comments.map((c) =>
    c._id.toString() !== commentId ? c : targetComment
  );

  await post.save();
  res.status(202).end();
};

const uploadImage = async (req, res) => {
  return res.status(200).send(req.file)
};

module.exports = {
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
};
