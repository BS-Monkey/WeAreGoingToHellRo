import axios from 'axios';
import backendUrl from '../backendUrl';
import { token } from './auth';

const baseUrl = `${backendUrl}/api/users`;

const setConfig = () => {
  return {
    headers: { 'x-auth-token': token },
  };
};

const getUser = async (username, limit, page) => {
  const response = await axios.get(
    `${baseUrl}/${username}/?limit=${limit}&page=${page}`
  );
  return response.data;
};

const getAllUsers = async () => {
  console.log('get All Users');
  const response = await axios.get(baseUrl);
  return response.data;
};

const uploadAvatar = async (avatarObj) => {
  const response = await axios.post(
    `${baseUrl}/avatar`,
    avatarObj,
    setConfig()
  );
  return response.data;
};

const removeAvatar = async () => {
  const response = await axios.delete(`${baseUrl}/avatar`, setConfig());
  return response.data;
};

const updateUser = async ({id, login_state, ban_state, role}) => {
  const response = await axios.post(
    `${baseUrl}/update/${id}`, 
    {
      login_state, 
      ban_state, 
      role
    }
  );
  return response.data;
}

const createUser = async (userobj) => {
  const response = await axios.post(`${baseUrl}/create`, userobj, setConfig());
  return response.data;
}

const getBanState = async (id) => {
  const response = await axios.get(`${baseUrl}/ban/${id}`);
  return response.data;
}

const setReadPosts = async ({id}) => {
  console.log(id);
  const response = await axios.post(`${baseUrl}/reads`, {id}, setConfig());
  return response.data;
}

const deleteUser = async (id) => {
  const response = await axios.delete(`${baseUrl}/delete/${id}`, setConfig());
  return response.data;
}

const verifyCaptcha = async (data) => {
  const response = await axios.post(`${baseUrl}/verify`, {data});
  return response.data;
}

const removeNotif = async ({user_id, notif_id}) => {
  const response = await axios.post(`${baseUrl}/removenotif`, {user_id, notif_id});
  return response.data;
}

const userService = { getUser, getAllUsers, getBanState, setReadPosts, uploadAvatar, removeAvatar, createUser, updateUser, deleteUser, verifyCaptcha, removeNotif };

export default userService;
