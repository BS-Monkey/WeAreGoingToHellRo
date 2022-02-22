import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { setUser, removeNotification } from './reducers/userReducer';
import { fetchUsers } from './reducers/usersReducer';
import { fetchPosts } from './reducers/postReducer';
import { fetchPinPosts } from './reducers/pinPostReducer';
import { setDarkMode } from './reducers/themeReducer';
import { notify } from './reducers/notificationReducer';
import NavBar from './components/NavBar';
import ToastNotif from './components/ToastNotif';
import Routes from './router/index';
import getErrorMsg from './utils/getErrorMsg';
import { Paper } from '@material-ui/core/';
import customTheme from './styles/customTheme';
import { useMainPaperStyles } from './styles/muiStyles';
import { ThemeProvider } from '@material-ui/core/styles';

const App = () => {
  const classes = useMainPaperStyles();
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state);
  const user = useSelector((state) => state.user);
  const history = useHistory();

  const createNotification = (title, content, url_link, id) => {
    NotificationManager.info(title, content, 5000, () => {
      dispatch(removeNotification(user.id, id));
      history.push(`/comments/${url_link}`);
    });
  };

  useEffect(() => {
    const setPostsAndSubreddits = async () => {
      try {
        await dispatch(fetchPinPosts());
        await dispatch(fetchPosts('hot', 0));
      } catch (err) {
        dispatch(notify(getErrorMsg(err), 'error'));
      }
    };

    dispatch(setUser());
    dispatch(fetchUsers());
    dispatch(setDarkMode());
    setPostsAndSubreddits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user.notifications && user.notifications.length !== 0) {
      user.notifications.map((n) => {
        createNotification(n.title, n.content, n.url_link, n._id);
      })
    }
    
  }, [user?.notifications]);

  return (
    <ThemeProvider theme={customTheme(darkMode)}>
      <Paper className={classes.root} elevation={0}>
        <ToastNotif />
        <NotificationContainer/>
        <NavBar />
        <Routes />
      </Paper>
    </ThemeProvider>
  );
};

export default App;
