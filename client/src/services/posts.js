import axios from 'axios';
import backendUrl from '../backendUrl';
import { token } from './auth';

const baseUrl = `${backendUrl}/api/posts`;

const setConfig = () => {
  return {
    headers: { 'x-auth-token': token },
  };
};

const getPosts = async (sortBy, flairBy, limit, page) => {
  const response = await axios.get(
    `${baseUrl}/?sortby=${sortBy}&limit=${limit}&page=${page}&flairBy=${flairBy}`
  );

  console.log(response.data);

  return response.data;
};

const getDeletedPosts = async () => {
  const response = await axios.get(`${baseUrl}/delete`);
  
  return response.data;
};

const getPinPosts = async () => {
  const response = await axios.get(
    `${baseUrl}/pin`
  );
  
  return response.data;
};

const getSubPosts = async (limit, page) => {
  const response = await axios.get(
    `${baseUrl}/subscribed/?limit=${limit}&page=${page}`,
    setConfig()
  );
  return response.data;
};

const getSearchResults = async (query, limit, page) => {
  const response = await axios.get(
    `${baseUrl}/search/?query=${query}&limit=${limit}&page=${page}`
  );
  return response.data;
};

const addNew = async (postObj) => {
  const { postType } = postObj;
  const response = await axios.post(`${baseUrl}`, postObj, setConfig());
  return response.data;  
};

const editPost = async (id, postObj) => {
  const response = await axios.patch(`${baseUrl}/${id}`, postObj, setConfig());
  return response.data;
};

const getPostComments = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`);
  return response.data;
};

const getAwardsCnt = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/awards`);
  return response.data;
};

const upvotePost = async (id) => {
  const response = await axios.post(
    `${baseUrl}/${id}/upvote`,
    null,
    setConfig()
  );
  return response.data;
};

const downvotePost = async (id) => {
  const response = await axios.post(
    `${baseUrl}/${id}/downvote`,
    null,
    setConfig()
  );
  return response.data;
};

const deletePost = async (id) => {
  const response = await axios.delete(`${baseUrl}/delete/${id}`, setConfig());
  return response.data;
};

const realDeletePost = async (id) => {
  console.log('real delete', id);
  const response = await axios.delete(`${baseUrl}/realdelete/${id}`, setConfig());
  return response.data;
};

const upvoteComment = async (postId, commentId) => {
  const response = await axios.post(
    `${baseUrl}/${postId}/comment/${commentId}/upvote`,
    null,
    setConfig()
  );

  console.log(response.data);
  return response.data;
};

const downvoteComment = async (postId, commentId) => {
  const response = await axios.post(
    `${baseUrl}/${postId}/comment/${commentId}/downvote`,
    null,
    setConfig()
  );
  return response.data;
};

const upvoteReply = async (postId, commentId, replyId) => {
  const response = await axios.post(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}/upvote`,
    null,
    setConfig()
  );
  return response.data;
};

const downvoteReply = async (postId, commentId, replyId) => {
  const response = await axios.post(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}/downvote`,
    null,
    setConfig()
  );
  return response.data;
};

const postComment = async (postId, commentObj) => {
  const response = await axios.post(
    `${baseUrl}/${postId}/comment`,
    commentObj,
    setConfig()
  );
  return response.data;
};

const postAward = async (postId, awardObj) => {
  console.log('give award to post');
  const response = await axios.post(
    `${baseUrl}/${postId}/award`,
    awardObj,
    setConfig()
  );
  return response.data;
};

const postReply = async (postId, commentId, replyObj) => {
  const response = await axios.post(
    `${baseUrl}/${postId}/comment/${commentId}/reply`,
    replyObj,
    setConfig()
  );

  return response.data;
};

const updateComment = async (postId, commentId, commentObj) => {
  const response = await axios.patch(
    `${baseUrl}/${postId}/comment/${commentId}`,
    commentObj,
    setConfig()
  );
  return response.data;
};

const removeComment = async (postId, commentId) => {
  const response = await axios.delete(
    `${baseUrl}/${postId}/comment/${commentId}`,
    setConfig()
  );
  return response.data;
};

const realRemoveComment = async (postId, commentId) => {
  const response = await axios.delete(
    `${baseUrl}/${postId}/real/comment/${commentId}`,
    setConfig()
  );
  return response.data;
};

const removeAward = async (postId, awardId) => {
  const response = await axios.delete(
    `${baseUrl}/${postId}/award/${awardId}`,
    setConfig()
  );
  return response.data;
};

const updateReply = async (postId, commentId, replyId, replyObj) => {
  const response = await axios.patch(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}`,
    replyObj,
    setConfig()
  );
  return response.data;
};

const removeReply = async (postId, commentId, replyId) => {
  const response = await axios.delete(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}`,
    setConfig()
  );
  return response.data;
};

const postService = {
  getPosts,
  getDeletedPosts, 
  getPinPosts, 
  getSubPosts,
  getSearchResults,
  addNew,
  editPost,
  getPostComments,
  getAwardsCnt, 
  upvotePost,
  downvotePost,
  deletePost,
  realDeletePost, 
  upvoteComment,
  downvoteComment,
  upvoteReply,
  downvoteReply,
  postComment,
  postAward, 
  postReply,
  updateComment,
  removeComment,
  realRemoveComment, 
  removeAward, 
  updateReply,
  removeReply,
};

export default postService;
