import authService from '../services/auth';
import userService from '../services/user';
import storageService from '../utils/localStorage';

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'SIGNUP':
      return action.payload;
    case 'LOGOUT':
      return null;
    case 'SET_USER':
      return action.payload;
    case 'REMOVE_NOTIF': 
      return {...state, ...action.payload};
    case 'SET_AVATAR':
      return { ...state, ...action.payload };
    case 'UPDATE_USER':
      return { ...state, ...action.payload };
    case 'REMOVE_AVATAR':
      return { ...state, avatar: { exists: false } };
    case 'BAN_STATE': 
      return { ...state, ...action.payload };     
    case 'CAPTCHA_STATE' : 
      return { ...state, ...action.payload };
    case 'POST_READS':
      return { ...state, ...action.payload};
    case 'DELETE_USER':
      return {
        ...state,
        allUsers: state.allUsers.filter((r) => r.id !== action.payload),
      };
    default:
      return state;
  }
};

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await authService.login(credentials);
    storageService.saveUser(user);
    authService.setToken(user.token);

    dispatch({
      type: 'LOGIN',
      payload: user,
    });
  };
};

export const userReadPost = (id) => {
  return async (dispatch) => {
    const readPost = await userService.setReadPosts({id});
    const prevUserData = storageService.loadUser();
    storageService.saveUser({ ...prevUserData, ...readPost });

    dispatch({
      type: 'POST_READS', 
      payload: readPost, 
    });
  };
};

export const signupUser = (credentials) => {
  console.log(credentials);
  return async (dispatch) => {
    const user = await authService.signup(credentials);
    storageService.saveUser(user);
    authService.setToken(user.token);

    dispatch({
      type: 'SIGNUP',
      payload: user,
    });
  };
};

export const logoutUser = (id) => {
  return async (dispatch) => {
    // const user = await authService.logout(id);
    storageService.logoutUser();
    authService.setToken(null);

    const user = await authService.logout(id);

    dispatch({
      type: 'LOGOUT',
    });
  };
};

export const setUser = () => {
  return (dispatch) => {
    const loggedUser = storageService.loadUser();

    if (loggedUser) {
      authService.setToken(loggedUser.token);

      dispatch({
        type: 'SET_USER',
        payload: loggedUser,
      });
    }
  };
};

export const setAvatar = (avatarImage) => {
  return async (dispatch) => {
    const uploadedAvatar = await userService.uploadAvatar({ avatarImage });
    const prevUserData = storageService.loadUser();
    storageService.saveUser({ ...prevUserData, ...uploadedAvatar });

    dispatch({
      type: 'SET_AVATAR',
      payload: uploadedAvatar,
    });
  };
};

export const deleteAvatar = () => {
  return async (dispatch) => {
    await userService.removeAvatar();
    const prevUserData = storageService.loadUser();
    storageService.saveUser({ ...prevUserData, avatar: { exists: false } });

    dispatch({
      type: 'REMOVE_AVATAR',
    });
  };
};

export const updateUser = (id, login_state, ban_state, role) => {
  return async (dispatch) => {
    const updateUser = await userService.updateUser({ id, login_state, ban_state, role });
    const prevUserData = storageService.loadUser();
    storageService.saveUser({ ...prevUserData, ...updateUser });

    dispatch({
      type: 'UPDATE_USER', 
      payload: updateUser, 
    });
  };
};

export const addNewUser = (userObj) => {
  return async (dispatch) => {
    const createdUser = await userService.createUser(userObj);

    dispatch({
      type: 'ADD_NEW_USER',
      payload: {
        username: createdUser.username,
        id: createdUser.id,
      },
    });
  };
};

export const getBanState = (id) => {
  return async (dispatch) => {
    const ban_state = await userService.getBanState(id);

    dispatch({
      type: 'BAN_STATE',
      payload: ban_state,
    });

    return ban_state;
  };
};

export const recaptchaVerify = (response) => {
  return async (dispatch) => {
    const captcha_state = await userService.verifyCaptcha(response);

    dispatch({
      type: 'CAPTCHA_STATE',
      payload: captcha_state,
    });

    return captcha_state;
  };
};

export const removeNotification = (user_id, notif_id) => {
  return async (dispatch) => {
    const remove_state = await userService.removeNotif({user_id, notif_id});
    const prevUserData = storageService.loadUser();
    storageService.saveUser({ ...prevUserData, ...remove_state });

    dispatch({
      type: 'REMOVE_NOTIF', 
      payload: remove_state, 
    });
  }
}

export const deleteUser = (id) => {
  return async (dispatch) => {
    await userService.deleteUser(id);

    dispatch({
      type: 'DELETE_USER',
      payload: id,
    });
  };
};

export default userReducer;
