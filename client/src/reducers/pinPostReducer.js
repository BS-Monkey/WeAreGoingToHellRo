import postService from '../services/posts';

const pinPostReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_PIN_POSTS':
      return action.payload;
    default:
      return state;
  }
};

export const fetchPinPosts = () => {
  return async (dispatch) => {
    const posts = await postService.getPinPosts();

    dispatch({
      type: 'SET_PIN_POSTS',
      payload: posts,
    });
  };
};

export default pinPostReducer;
