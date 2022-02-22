import authService from '../services/auth';
import userService from '../services/user';
import storageService from '../utils/localStorage';

const usersReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return action.payload;
    default:
      return state;
  }
};

export const fetchUsers = () => {
  console.log('get User List');
  return async (dispatch) => {
    const users = await userService.getAllUsers();

    dispatch({
      type: 'SET_USERS', 
      payload: users
    });
  };
};

export default usersReducer;
