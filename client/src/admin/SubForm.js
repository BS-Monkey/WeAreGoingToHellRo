import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addNewUser } from '../reducers/userReducer';
import { Formik, Form } from 'formik';
import { TextInput } from './FormikMuiFields';
import { notify } from '../reducers/notificationReducer';
import AlertMessage from './AlertMessage';
import * as yup from 'yup';
import getErrorMsg from '../utils/getErrorMsg';

import { useSubredditFormStyles } from '../styles/muiStyles';
import { Button, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import AddIcon from '@material-ui/icons/Add';
import {frontendUrl} from '../backendUrl';

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Required')
    .max(20, 'Must be at most 20 characters')
    .min(3, 'Must be at least 3 characters')
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      'Only alphanumeric characters allowed, no spaces/symbols'
    ),
  password: yup
    .string()
    .required('Required')
    .max(100, 'Must be at most 100 characters')
    .min(8, 'Must be at least 8 characters'),
});

const SubForm = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const classes = useSubredditFormStyles();
  const history = useHistory();

  const handleCreateUser = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await dispatch(addNewUser(values));
      setSubmitting(false);
      dispatch(
        notify(`New User created: ${values.username}`, 'success')
      );
      // history.push(`/r/${values.subredditName}`);
      // history.push(`/`);
      //////////when create user, dialog doesn't disappear. /////////////////
      document.location = frontendUrl;
    } catch (err) {
      setSubmitting(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <div className={classes.formWrapper}>
      <Formik
        validateOnChange={true}
        initialValues={{ username: '', password: '' }}
        onSubmit={handleCreateUser}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <div className={classes.input}>
              <Typography
                className={classes.inputIconText}
                color="primary"
                variant="h5"
              >
                username
              </Typography>
              <TextInput
                name="username"
                type="text"
                placeholder="Enter username"
                label="User Name"
                required
                fullWidth
              />
            </div>
            <div className={classes.descInput}>
              <Typography
                className={classes.inputIconText}
                color="primary"
                variant="h5"
              >
                password
              </Typography>
              <TextInput
                name="password"
                type="password"
                placeholder="Enter password"
                label="Password"
                required
                fullWidth
              />
            </div>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              size="large"
              className={classes.submitButton}
              disabled={isSubmitting}
              startIcon={<AddIcon />}
            >
              Create User
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
  );
};

export default SubForm;
