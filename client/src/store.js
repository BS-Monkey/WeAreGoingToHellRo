import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import notificationReducer from './reducers/notificationReducer';
import userReducer from './reducers/userReducer';
import postReducer from './reducers/postReducer';
import pinPostReducer from './reducers/pinPostReducer';
import deletedPostReducer from './reducers/deletedPostReducer';
import subReducer from './reducers/subReducer';
import usersReducer from './reducers/usersReducer';
import postCommentsReducer from './reducers/postCommentsReducer';
import userPageReducer from './reducers/userPageReducer';
import subPageReducer from './reducers/subPageReducer';
import searchReducer from './reducers/searchReducer';
import themeReducer from './reducers/themeReducer';

const reducer = combineReducers({
  user: userReducer,
  notification: notificationReducer,
  posts: postReducer,
  pinPosts: pinPostReducer, 
  deletedPosts: deletedPostReducer, 
  postComments: postCommentsReducer,
  subs: subReducer,
  userPage: userPageReducer,
  subPage: subPageReducer,
  search: searchReducer,
  darkMode: themeReducer,
  users: usersReducer, 
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
