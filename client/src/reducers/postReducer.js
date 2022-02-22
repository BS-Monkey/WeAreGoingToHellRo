import postService from '../services/posts';
import userService from '../services/user';

const postReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return action.payload;
    case 'LOAD_MORE_POSTS':
      return {
        ...action.payload,
        results: [...state.results, ...action.payload.results],
      };
    case 'TOGGLE_VOTE':
      return {
        ...state,
        results: state.results.map((r) =>
          r.id !== action.payload.id ? r : { ...r, ...action.payload.data }
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        results: state.results.filter((r) => r.id !== action.payload),
      };
    default:
      return state;
  }
};

export const fetchPosts = (sortBy, flairBy) => {
  return async (dispatch) => {
    const posts = await postService.getPosts(sortBy, flairBy, 10, 1);

    dispatch({
      type: 'SET_POSTS',
      payload: posts,
    });
  };
};

export const loadMorePosts = (sortBy, flairBy, page) => {
  console.log(sortBy, flairBy, page);
  return async (dispatch) => {
    const posts = await postService.getPosts(sortBy, flairBy, 10, page);

    console.log('loadMorePosts', posts);

    dispatch({
      type: 'LOAD_MORE_POSTS',
      payload: posts,
    });
  };
};

export const createNewPost = (postObject) => {
  return async (dispatch) => {
    const addedPost = await postService.addNew(postObject);

    console.log(addedPost);

    dispatch({
      type: 'CREATE_NEW_POST',
      payload: addedPost,
    });

    return addedPost.id;
  };
};


export const updatePost = (id, postObject) => {
  console.log(postObject);
  return async (dispatch) => {
    const updatedPost = await postService.editPost(id, postObject);

    dispatch({
      type: 'UPDATE_POST',
      payload: updatedPost,
    });
  };
};

export const toggleUpvote = (id, upvotedBy, downvotedBy) => {
  return async (dispatch) => {
    let pointsCount = upvotedBy.length - downvotedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: 'TOGGLE_VOTE',
      payload: { id, data: { upvotedBy, pointsCount, downvotedBy } },
    });

    await postService.upvotePost(id);
  };
};

export const toggleDownvote = (id, downvotedBy, upvotedBy) => {
  return async (dispatch) => {
    let pointsCount = upvotedBy.length - downvotedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: 'TOGGLE_VOTE',
      payload: { id, data: { upvotedBy, pointsCount, downvotedBy } },
    });

    await postService.downvotePost(id);
  };
};

export const removePost = (id) => {
  console.log(id);
  return async (dispatch) => {
    await postService.deletePost(id);

    dispatch({
      type: 'DELETE_POST',
      payload: id,
    });
  };
};

export const realRemovePost = (id) => {
  return async (dispatch) => {
    await postService.realDeletePost(id);

    dispatch({
      type: 'DELETE_POST',
      payload: id,
    });
  };
};

export default postReducer;
