import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { updateUser, deleteUser } from '../reducers/userReducer';
import { Formik, Form } from 'formik';
import { TextInput } from './FormikMuiFields';
import { notify } from '../reducers/notificationReducer';
import AlertMessage from './AlertMessage';
import { DialogTitle } from './CustomDialogTitle';
import * as yup from 'yup';
import getErrorMsg from '../utils/getErrorMsg';

import { useSubredditFormStyles } from '../styles/muiStyles';
import { 
  Button, 
  IconButton,    
  Dialog,
  DialogContent,
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  DialogContentText, 
  DialogActions, 
  useMediaQuery,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { useTheme } from '@material-ui/core/styles';

const validationSchema = yup.object({
  subredditName: yup
    .string()
    .required('Required')
    .max(20, 'Must be at most 20 characters')
    .min(3, 'Must be at least 3 characters')
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      'Only alphanumeric characters allowed, no spaces/symbols'
    ),
  description: yup
    .string()
    .required('Required')
    .max(100, 'Must be at most 100 characters')
    .min(3, 'Must be at least 3 characters'),
});

const UpdateUserDialog = (props) => {  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const {modalData} = props;
  const [error, setError] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const user = useSelector((state) => state.user);
  const [role, setRole] = React.useState(modalData.role);
  const [login_state, setLoginState] = React.useState('true');
  const [ban_state, setBanState] = React.useState('false');


  const dispatch = useDispatch();
  const classes = useSubredditFormStyles();
  const history = useHistory();
  const location = useLocation();

  const handleChange = (event) => {
    console.log(event.target.value);
    setRole(event.target.value);
  };


  const handleLoginChange = (event) => {
    setLoginState(event.target.value);
  }

  const handleBanChange = (event) => {
    setBanState(event.target.value);
  }

  const handleClickEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleClickDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDeleteUser = async () => {
    try {
      handleDeleteClose();
      console.log(modalData.id);
      await dispatch(deleteUser(modalData.id));
      dispatch(notify(`User deleted!`, 'success'));
      if (location.pathname !== '/manage') {
        // history.push('/manage');
        document.location = '/manage';
      }
      // document.location = '/';
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleUpdateUser = async () => {
    try {
      await dispatch(updateUser(modalData.id, login_state, ban_state, role));
      dispatch(
        notify(`${modalData.username} is updated.`, 'success')
      );
      // history.push(`/manage`);
      // history.push(`/user/update/${modalData.id}`);
      document.location = '/manage';
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <div>
      {!isMobile ? (
        <>        
          <IconButton onClick={handleClickEditOpen}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleClickDeleteOpen}>
            <DeleteIcon />
          </IconButton>
        </>
      ) : (
        <>       
          <IconButton onClick={handleClickEditOpen} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleClickDeleteOpen} size="small">
            <DeleteIcon />
          </IconButton>
        </>
      )}
      <Dialog
        open={openEdit}
        onClose={handleEditClose}
        maxWidth="xs"
        classes={{ paper: classes.dialogWrapper }}
        fullWidth
      >
        <DialogTitle onClose={handleEditClose}>{modalData.username}</DialogTitle>
        <DialogContent>
          <div className={classes.formWrapper}>
            <Formik
              validateOnChange={true}
              initialValues={{ login_state: '', ban_state: '', role: '' }}
              onSubmit={handleUpdateUser}
              validationSchema={validationSchema}
              style={{align: 'center'}}
            >
              {({ isSubmitting }) => (
                <Form className={classes.form}>
                  <div className={classes.input}>
                    {!isMobile ? (
                      <h4 style={{marginBottom: '12px'}}>Login_State</h4>
                    ) : (
                      <h4 style={{marginBottom: '55px'}}>Login_State</h4>
                    )}
                    <FormControl component="fieldset" style={{marginLeft: '30px', marginTop: '0px'}}>
                      <RadioGroup row value={login_state} aria-label="gender" name="customized-radios" onChange={handleLoginChange} >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" style={{marginLeft: '10px'}}/>
                        <FormControlLabel value="false" control={<Radio />} label="No" style={{marginLeft: '10px'}}/>
                      </RadioGroup>
                    </FormControl>                    
                  </div>
                  <div className={classes.Input}>
                    <h4 style={{marginBottom: '15px'}}>Banned_State</h4>
                    <FormControl component="fieldset" style={{marginLeft: '120px', marginTop: '-45px'}}>
                      <RadioGroup row value={ban_state} aria-label="gender" name="customized-radios" onChange={handleBanChange} >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" style={{marginLeft: '10px'}}/>
                        <FormControlLabel value="false" control={<Radio />} label="No" style={{marginLeft: '10px'}}/>
                      </RadioGroup>
                    </FormControl>         
                  </div>
                  <div className={classes.Input}>
                    <h4 style={{marginBottom: '10px'}}>Role</h4>
                    <FormControl className={classes.formControl} style={{marginLeft: '150px', marginTop: '-45px', width: '40%'}}>
                      <InputLabel id="demo-controlled-open-select-label">Role</InputLabel>
                      <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={role}
                        onChange={handleChange}
                      >
                        <MenuItem value={0}>
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Admin</MenuItem>
                        <MenuItem value={2}>Moderator</MenuItem>
                        <MenuItem value={3}>Client</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    size="large"
                    className={classes.submitButton}
                    disabled={isSubmitting}
                    startIcon={<ArrowUpwardIcon />}
                    onClick={handleUpdateUser}
                  >
                    {isSubmitting ? 'Updating' : 'Update User'}
                  </Button>
                </Form>
              )}
            </Formik>
            <AlertMessage
              error={error}
              severity="error"
              clearError={() => setError(null)}
            />
          </div>          
        </DialogContent>
      </Dialog>
      <Dialog 
        open={openDelete} 
        keepMounted onClose={handleDeleteClose}
      >
        <DialogTitle>
          {`Delete User u/${modalData.username}?`}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to delete u/{modalData.username}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            color="primary"
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="primary"
            variant="contained"
            size="small"
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>    
    </div>
  );
};

export default UpdateUserDialog;
