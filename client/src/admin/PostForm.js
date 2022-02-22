import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { matchPath, useHistory } from 'react-router-dom';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftTToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Formik, Form } from 'formik';
import { TextInput } from './FormikMuiFields';
import generateBase64Encode from '../utils/genBase64Encode';
import { createNewPost, updatePost } from '../reducers/postReducer';
import { notify } from '../reducers/notificationReducer';
import * as yup from 'yup';
import AlertMessage from './AlertMessage';
import getErrorMsg from '../utils/getErrorMsg';
import '../styles/custom.css';

import {
  Button,
  ButtonGroup,
  Grid, 
  FormControlLabel, 
  Checkbox, 
  useMediaQuery,
  IconButton,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  withStyles, 
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { usePostFormStyles } from '../styles/muiStyles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTheme } from '@material-ui/core/styles';
import TitleIcon from '@material-ui/icons/Title';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link';
import PublishIcon from '@material-ui/icons/Publish';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import ChatIcon from '@material-ui/icons/Chat';
import PostAddIcon from '@material-ui/icons/PostAdd';
import EditIcon from '@material-ui/icons/Edit';
import ClassIcon from '@material-ui/icons/Class';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import { flairKind, max_img_size, max_video_size, blacklistWords } from '../backendUrl';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const validationSchema = yup.object({
  title: yup.string().required('Required'),
  textSubmission: yup.string(),
  imageSubmission: yup.string(),
  videoSubmission: yup.string(), 
  linkSubmission: yup
    .string()
    .matches(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/,
      'Valid URL required'
    ),
});

const AddPostForm = ({
  postType,
  actionType,
  postToEditType,
  postToEditTitle,
  postToEditId,
  textSubmission,
  linkSubmission,
  flairSubmission, 
  imageSubmission, 
  videoSubmission, 
  pinSubmission, 
  lockSubmission, 
  is_pinned, 
  is_locked
}) => {
  const [imageFileName, setImageFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [pinState, setPinState] = useState(() => {
    if(is_pinned) {
      return is_pinned;
    } else {
      return false;
    }
  });
  const [lockState, setLockState] = useState(() => {
    if(is_locked) {
      return is_locked;
    } else {
      return false;
    }
  });
  const [editorState, setEditorState] = useState(() =>
    {
      if (textSubmission) {
        console.log(textSubmission);
        let blocksFromHtml = htmlToDraft(textSubmission);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
       } else {
        EditorState.createEmpty();
       }  
    }
  );
  const [error, setError] = useState(null);
  const [flair, setFlair] = useState(flairSubmission);
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = usePostFormStyles();

  const handleChange = (event, setFieldValue) => {
    setFlair(event.target.value);
    setFieldValue('flairSubmission', event.target.value);
  };

  const handlePinCheckChange = (event, setFieldValue) => {
    setFieldValue('is_pinned', event.target.checked);
    setPinState(event.target.checked);
  }

  const handleLockCheckChange = (event, setFieldValue) => {
    setFieldValue('is_locked', event.target.checked);
    setLockState(event.target.checked);
  }

  const handleTextChange = (event, setFieldValue) => {
    setEditorState(event);
    let tempText = draftTToHtml(convertToRaw(event.getCurrentContent()));
    setFieldValue('textSubmission', tempText);
  };

  const imageFileInputOnChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if(file.size > max_img_size && user && user.userrole && user.userrole > 2) {
      alert('Maximum file size exceed, This file size is more than ' + Math.floor(file.size/1024/1024) + 'MB.');
      return false;
    } else {
      setImageFileName(file.name);
      generateBase64Encode(file, setFieldValue);
    }    
  };

  const videoFileInputOnChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if(file.size > max_video_size && user && user.userrole && user.userrole > 2) {
      alert('Maximum file size exceed, This file size is more than ' + Math.floor(file.size/1024/1024) + 'MB');
      return false;
    } else {
      setVideoFileName(file.name);
      generateBase64Encode(file, setFieldValue, false, 'video');
    }  
  };

  const clearImageFileSelection = (setFieldValue) => {
    setFieldValue('imageSubmission', '');
    setImageFileName('');
  };

  const clearVideoFileSelection = (setFieldValue) => {
    console.log("video file canceled");
    setFieldValue('videoSubmission', '');
    setVideoFileName('');
  };

  const handleAddPost = async (values, { setSubmitting }) => {
    if(!values.is_pinned) values.is_pinned = false;
    if(!values.is_locked) values.is_locked = false;
    if (values.textSubmission) {
      if (values.textSubmission.length > 10008) {
        alert('post character must be less than 10000.');
        return;
      }    
      for (let i = 0; i < blacklistWords.length; i ++) {
        if (values.textSubmission.includes(blacklistWords[i])) {
          alert('You can not type the words ' + `'${blacklistWords[i]}'`);
          return false;
        }
        if (values.title.includes(blacklistWords[i])) {
          alert('You can not type the words ' + `'${blacklistWords[i]}'`);
          return false;
        }
      }
    }

    try {
      setSubmitting(true);
      const postId = await dispatch(createNewPost(values));
      setSubmitting(false);
      // history.push(`/comments/${postId}`);
      document.location = `/comments/${postId}`;
      dispatch(notify('Added new post!', 'success'));
    } catch (err) {
      setSubmitting(false);
      setError(getErrorMsg(err));
    }
  };

  const handleUpdatePost = async (values, { setSubmitting }) => {
    if(!values.is_pinned) values.is_pinned = false;
    if(!values.is_locked) values.is_locked = false;
    if (values.textSubmission) {
      if (values.textSubmission.length > 10008) {
        alert('post character must be less than 10000.');
        return;
      }    
      for (let i = 0; i < blacklistWords.length; i ++) {
        if (values.textSubmission.includes(blacklistWords[i])) {
          alert('You can not type the words ' + `'${blacklistWords[i]}'`);
          return false;
        }
        if (values.title.includes(blacklistWords[i])) {
          alert('You can not type the words ' + `'${blacklistWords[i]}'`);
          return false;
        }
      }
    }
    
    try {
      setSubmitting(true);
      console.log(values);
      await dispatch(updatePost(postToEditId, values));
      setSubmitting(false);
      // history.push(`/comments/${postToEditId}`);
      document.location = `/comments/${postToEditId}`;
      dispatch(notify('Successfully updated the post!', 'success'));
    } catch (err) {
      setSubmitting(false);
      setError(getErrorMsg(err));
    }
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          title: actionType === 'edit' ? postToEditTitle : '',
          postType: actionType === 'edit' ? postToEditType : postType,
          textSubmission: actionType === 'edit' ? textSubmission : '',
          linkSubmission: actionType === 'edit' ? linkSubmission : '',
          flairSubmission: actionType === 'edit' ? flairSubmission : 0, 
          imageSubmission: actionType === 'edit' ? imageSubmission : '',
          videoSubmission: actionType === 'edit' ? videoSubmission : '',
          is_pinned: actionType === 'edit' ? pinSubmission : false, 
          is_locked: actionType === 'edit' ? lockSubmission : false, 
        }}
        onSubmit={actionType === 'edit' ? handleUpdatePost : handleAddPost}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className={classes.form}>
            {actionType !== 'edit' && (
              <ButtonGroup
                color="secondary"
                fullWidth
                className={classes.typeBtnGroup}
              >
                <Button
                  onClick={() => setFieldValue('postType', 'Text')}
                  variant={
                    values.postType === 'Text' ? 'contained' : 'outlined'
                  }
                >                  
                  <TextFormatIcon style={{ marginRight: 2 }} />
                  {!isMobile && (
                    <>Text</>
                  )}
                </Button>
                <Button
                  onClick={() => setFieldValue('postType', 'Image')}
                  variant={
                    values.postType === 'Image' ? 'contained' : 'outlined'
                  }
                >
                  <ImageIcon style={{ marginRight: 5 }} />
                  {!isMobile && (
                    <>Image</>
                  )}
                </Button>                
                <Button
                  onClick={() => setFieldValue('postType', 'Video')}
                  variant={
                    values.postType === 'Video' ? 'contained' : 'outlined'
                  }
                >
                  <MovieFilterIcon style={{ marginRight: 5 }} />
                  {!isMobile && (
                    <>Video</>
                  )}
                </Button>
                <Button
                  onClick={() => setFieldValue('postType', 'Link')}
                  variant={
                    values.postType === 'Link' ? 'contained' : 'outlined'
                  }
                >
                  <LinkIcon style={{ marginRight: 5 }} />
                  {!isMobile && (
                    <>Link</>
                  )}
                </Button>
              </ButtonGroup>
            )}
            <div className={classes.input}>
              <TitleIcon className={classes.inputIcon} style={{opacity: 0}} />
              <TextInput
                name="title"
                type="text"
                placeholder="Enter title"
                label="Title"
                required
                fullWidth
                disabled={actionType === 'edit'}
              />
            </div>
            {values.postType === 'Text' && (
              <div className={classes.textInput} style={{alignItems: 'flex-start'}}>
                <ChatIcon className={classes.inputIcon} color="primary" />
                <div style={{ border: "1px solid black", padding: '2px', width: '100%' }}>
                  <Editor
                    editorState={editorState}
                    defaultEditorState={editorState}
                    onEditorStateChange={(event) => handleTextChange(event, setFieldValue)}
                  />
                </div>
              </div>
            )}
            {values.postType === 'Image' && (
              <div className={classes.imageInput}>
                <div className={classes.imageBtnsWrapper}>
                  <ImageIcon className={classes.inputIcon} color="primary" />
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    hidden
                    onChange={(e) => imageFileInputOnChange(e, setFieldValue)}
                    required={values.postType === 'Image'}
                  />
                  <Button
                    component="label"
                    htmlFor="image-upload"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={
                      values.imageSubmission ? (
                        <CheckCircleIcon />
                      ) : (
                        <PublishIcon />
                      )
                    }
                    size={isMobile ? 'small' : 'medium'}
                    className={classes.selectBtn}
                  >
                    {values.imageSubmission
                      ? `${isMobile 
                            ? user && user.userrole && user.userrole < 3 
                              ? 'max:no limit'
                              : 'max:4MB'
                            : 'Selected '}"${imageFileName}"`
                      : `${user && user.userrole && user.userrole < 3
                            ? 'Select Image'
                            : 'Select Image (max:4MB)'}`
                    }
                  </Button>
                  {values.imageSubmission && (
                    <IconButton
                      onClick={() => clearImageFileSelection(setFieldValue)}
                      color="secondary"
                      size={isMobile ? 'small' : 'medium'}
                      className={classes.clearSelectionBtn}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </div>
                {!isMobile && values.imageSubmission && (
                  <div className={classes.imagePreview}>
                    <img
                      alt={imageFileName}
                      src={values.imageSubmission}
                      width={isMobile ? 250 : 350}
                    />
                  </div>
                )}
              </div>
            )}
            {values.postType === 'Video' && (
              <div className={classes.imageInput}>
                <div className={classes.imageBtnsWrapper}>
                  <MovieFilterIcon className={classes.inputIcon} color="primary" />
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    hidden
                    onChange={(e) => videoFileInputOnChange(e, setFieldValue)}
                    required={values.postType === 'Video'}
                  />
                  <Button
                    component="label"
                    htmlFor="video-upload"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={
                      values.videoSubmission ? (
                        <CheckCircleIcon />
                      ) : (
                        <PublishIcon />
                      )
                    }
                    size={isMobile ? 'small' : 'medium'}
                    className={classes.selectBtn}
                  >
                    {values.videoSubmission
                      ? `${isMobile 
                            ? user && user.userrole && user.userrole < 3 
                              ? 'max:no limit'
                              : 'max:20MB'
                            : 'Selected '}"${videoFileName}"`
                      : `${user && user.userrole && user.userrole < 3
                            ? 'Select Video'
                            : 'Select Video (max:20MB)'}`
                    }
                  </Button>
                  {values.videoSubmission && (
                    <IconButton
                      onClick={() => clearVideoFileSelection(setFieldValue)}
                      color="secondary"
                      size={isMobile ? 'small' : 'medium'}
                      className={classes.clearSelectionBtn}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </div>
                {!isMobile && values.videoSubmission && (
                  <div className={classes.imagePreview}>
                    <video width="320" height="240" controls>
                      <source src={values.videoSubmission} type="video/mp4"/>
                    </video>
                  </div>
                )}
              </div>
            )}
            {values.postType === 'Link' && (
              <div className={classes.input}>
                <LinkIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  name="linkSubmission"
                  type="text"
                  placeholder="Enter URL"
                  label="Link"
                  required={values.postType === 'Link'}
                  fullWidth
                  variant={actionType === 'edit' ? 'outlined' : 'standard'}
                />
              </div>
            )}
            <div className={classes.textInput}>
              <ClassIcon className={classes.inputIcon} color="primary" />
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel id="post-flair">Flair</InputLabel>
                <Select
                  labelId="post-flair"
                  id="flairSubmission"
                  name="flairSubmission"
                  value={flair}
                  onChange={(event) => handleChange(event, setFieldValue)}
                >
                  {flairKind.map((row) => (
                    <MenuItem key={row.id} value={row.id} disabled={!(user.userrole <= row.role)} style={{color: '$row.background'}}>
                      {row.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {user && user.userrole < 3 && (
              <div className={classes.textInput}>
                <AddToPhotosIcon className={classes.inputIcon} color="primary" />
                <Grid container>
                  <Grid item md={1} xs={1}></Grid>
                  <Grid item md={3} xs={11}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={pinState}
                          onChange={(event) => handlePinCheckChange(event, setFieldValue)}
                          name="is_pinned"
                          color="primary"
                        />
                      }
                      label="Pin_State"
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item md={1} xs={1}></Grid>
                  <Grid item md={3} xs={11}>
                  <FormControlLabel
                    control={
                      <GreenCheckbox 
                        checked={lockState}
                        onChange={(event) => handleLockCheckChange(event, setFieldValue)}
                        name="is_locked"
                        color="primary"
                      />
                    }
                    label="Lock_State"
                    labelPlacement="end"
                  />
                  </Grid>
                </Grid>
              </div>              
            )}
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              size="large"
              className={classes.submitButton}
              disabled={isSubmitting}
              startIcon={postToEditId ? <EditIcon /> : <PostAddIcon />}
            >
              {postToEditId
                ? isSubmitting
                  ? 'Updating'
                  : 'Update'
                : isSubmitting
                ? 'Posting'
                : 'Post'}
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

export default AddPostForm;
