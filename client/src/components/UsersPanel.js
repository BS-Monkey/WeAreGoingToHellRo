import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SubFormModal from '../admin/SubFormModal';
import LoadingSpinner from './LoadingSpinner';
import storageService from '../utils/localStorage';

import {
  Paper,
  Typography,
  useMediaQuery,
  Divider, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemSecondaryAction, 
  ListItemText, 
  Avatar, 
  IconButton, 
  Grid, 
  Button
} from '@material-ui/core';

import Brightness1Icon from '@material-ui/icons/Brightness1';

import { useUsersPanelStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import { flairKind } from '../backendUrl';

const UsersPanel = () => {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(false);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const [loggedUser, setLoggedUser] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const classes = useUsersPanelStyles();
  const theme = useTheme();
  const isNotDesktop = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setLoggedUser(storageService.loadUser() || user);
    setLoadingUsers(!(users && users.length!== 0));
  }, [user, users]);
  
  if (isNotDesktop) {
    return null;
  }

  console.log(users);
  console.log(user);

  return (
    <Paper variant="outlined" className={classes.mainPaper}>
      <Paper variant="outlined" className={classes.listPaper}>
        <Typography variant="h5" color="secondary" className={classes.title}>
          All Users
        </Typography>
        <Divider />
        {loadingUsers ? (
          <LoadingSpinner text="Finding Users data..." />
        ) : (
          <div style={{ width: '100%'}}>
            <div className={classes.demo}>
              <List dense={dense}>
                {users.map((row) => (
                  <div key={row.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar alt={row.username} src={row.avatar.imageLink} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={row.username}
                        secondary={secondary ? 'Secondary text' : null}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          {user && user.username && user.username === row.username
                          ? (
                            <Brightness1Icon style={{color: 'lightgreen'}} />
                          )
                          : row.is_logined ? (
                            <Brightness1Icon style={{color: 'lightgreen'}} />
                          ) : (
                            <Brightness1Icon style={{color: 'gray'}} />
                          )}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </div>
          </div>
        )}
      </Paper>
      {loggedUser && <SubFormModal />}
    </Paper>
  );
};

export default UsersPanel;
