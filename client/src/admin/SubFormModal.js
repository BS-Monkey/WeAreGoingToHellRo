import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SubForm from './SubForm';

import { DialogTitle } from './CustomDialogTitle';
import {
  Dialog,
  DialogContent,
  Button,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import { useDialogStyles } from '../styles/muiStyles';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const SubFormModal = ({ type, handleCloseMenu }) => {
  const classes = useDialogStyles();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state);

  let userRole = 3;
  if(user && user.userrole) {
    userRole = user.userrole;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMenu = () => {
    handleClickOpen();
    handleCloseMenu();
  };

  return (
    <div>
      {type !== 'menu'
        ? userRole === 1 
          ? (
            <Button
              color="primary"
              variant="contained"
              onClick={handleClickOpen}
              fullWidth
              className={classes.createSubBtn}
              size="large"
              startIcon={<AddCircleIcon />}
            >
              Create New User
            </Button>
          )
          : (
            null
          )
        : userRole === 1
          ? (
            <MenuItem onClick={handleOpenMenu}>
              <ListItemIcon>
                <AddCircleIcon style={{ marginRight: 7 }} />
                Create User
              </ListItemIcon>
            </MenuItem>
          )
          : (
            null
          )
      }
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        classes={{ paper: classes.dialogWrapper }}
        fullWidth
      >
        <DialogTitle onClose={handleClose}>Create a new User</DialogTitle>
        <DialogContent>
          <SubForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubFormModal;
