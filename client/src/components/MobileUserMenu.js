import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import AuthFormModal from './AuthFormModal';
import SubFormModal from './SubFormModal';
import UpdateAvatarModal from './UpdateAvatarModal';
import DarkModeMenuItem from './DarkModeMenuItem';
import { getCircularAvatar } from '../utils/cloudinaryTransform';
import storageService from '../utils/localStorage';

import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Divider,
} from '@material-ui/core';
import { useUserMenuStyles } from '../styles/muiStyles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { frontendUrl } from '../backendUrl';

const MobileUserMenu = ({ users, handleLogout }) => {
  const clientUrl = frontendUrl;
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useUserMenuStyles();

  const user = useSelector((state) => state);
  
  let userRole = 3;
  if(user && user.user && user.user.userrole) 
    userRole = user.user.userrole;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

  const handleManageClick = () => {
    window.location.href = clientUrl + '/manage';
  }

  const loggedUser = storageService.loadUser() || user;
  console.log(loggedUser);

  return (
    <div>
      {(loggedUser && loggedUser.username && loggedUser.username !== '') ? (
        <IconButton onClick={handleMenu} className={classes.userBtnMob}>
          {loggedUser?.avatar?.exists ? (
            <Avatar
              alt={loggedUser.username}
              src={getCircularAvatar(loggedUser.avatar.imageLink)}
              className={classes.avatar}
            />
          ) : (
              <Avatar className={classes.avatar}>{loggedUser.username[0]}</Avatar>
          )}
          <MoreVertIcon color="primary" />
        </IconButton>
      ) : (
        <IconButton onClick={handleMenu} color="primary">
          <MoreVertIcon color="primary" />
        </IconButton>
      )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {(loggedUser && loggedUser.username && loggedUser.username !== '') ? (
          <div>
            <MenuItem
              component={RouterLink}
              to={`/u/${loggedUser.username}`}
              onClick={handleClose}
            >
              <ListItemIcon>
                <AccountCircleIcon style={{ marginRight: 7 }} /> My Profile
              </ListItemIcon>
            </MenuItem>
            <SubFormModal type="menu" handleCloseMenu={handleClose} />
            <UpdateAvatarModal
              handleCloseMenu={handleClose}
              user={loggedUser}
            />
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <PowerSettingsNewIcon style={{ marginRight: 7 }} /> Logout
              </ListItemIcon>
            </MenuItem>
            <Divider variant="middle" />
            {
              userRole !== 3 && 
              <MenuItem onClick={handleManageClick}>
                <ListItemIcon>
                  <SupervisorAccountIcon style={{ marginRight: 7 }} /> Manage
                </ListItemIcon>
              </MenuItem>
            }
            <Divider variant="middle" />
            <DarkModeMenuItem closeMenu={handleClose} />
          </div>
        ) : (
          <div>
            <AuthFormModal closeMobileMenu={handleClose} />
            <Divider variant="middle" />
            <DarkModeMenuItem closeMenu={handleClose} />
          </div>
        )}
      </Menu>
    </div>
  );
};

export default MobileUserMenu;
