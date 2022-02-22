import postService from '../services/posts';

const deletedPostReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_DELETED_POSTS':
      console.log('deleted Posts', action.payload);
      return action.payload;
    default:
      return state;
  }
};

export const fetchDeletedPosts = () => {
    return async (dispatch) => {
      const posts = await postService.getDeletedPosts();

      console.log(posts);
  
      dispatch({
        type: 'SET_DELETED_POSTS',
        payload: posts,
      });
    };
  };

export default deletedPostReducer;
