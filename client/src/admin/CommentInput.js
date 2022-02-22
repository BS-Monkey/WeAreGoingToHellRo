import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addComment, addAward } from '../reducers/postCommentsReducer';
import { notify } from '../reducers/notificationReducer';
import getErrorMsg from '../utils/getErrorMsg';
import dateFormat  from 'dateformat';
import DeleteDialog from './DeleteDialog';
import { removeAward } from '../reducers/postCommentsReducer';

import { 
  Link, 
  Typography, 
  TextField, 
  Button, 
} from '@material-ui/core';
import { useCommentInputStyles } from '../styles/muiStyles';
import SendIcon from '@material-ui/icons/Send';
import { blacklistWords } from '../backendUrl';

const CommentInput = ({ user, postId, post, isMobile }) => {
  const classes = useCommentInputStyles();
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (comment.length > 3000) {
      alert('comment character must be less than 3000.');
      return;
    }
    for (let i = 0; i < blacklistWords.length; i ++) {
      if (comment.includes(blacklistWords[i])) {
        alert('You can not type the words ' + `'${blacklistWords[i]}'`);
        return false;
      }
    }
    try {
      setSubmitting(true);
      await dispatch(addComment(postId, comment));
      setSubmitting(false);
      setComment('');
      dispatch(notify(`Comment submitted!`, 'success'));
    } catch (err) {
      setSubmitting(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  let canComment = true;
  if(post && post.comments && user) {
    for(let i = 0; i < post.comments.length; i ++) {
      if(user.id === post.comments[i].commentedBy.id) 
        canComment = false;
    }
  }

  let flag = user && user.username && user.username !== '';

  return (
    <div className={classes.wrapper}>
      {canComment
      ? (
        <div>
          {flag
          ? (
            <Typography variant="body2">
              Comment as{' '}
              <Link component={RouterLink} to={`/u/${user.username}`}>
                {user.username}
              </Link>
            </Typography>
          ) : (
            <Typography variant="body1">
              Log in or sign up to leave a comment
            </Typography>
          )}
          <form className={classes.form} onSubmit={handlePostComment}>
            <TextField
              placeholder={`What are your thoughts?`}
              multiline
              fullWidth
              required
              rows={4}
              rowsMax={Infinity}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.commentBtn}
              startIcon={<SendIcon />}
              size={isMobile ? 'small' : 'medium'}
              disabled={!flag || submitting}
            >
              {!flag ? 'Login to comment' : submitting ? 'Commenting' : 'Comment'}
            </Button>
          </form>
        </div>
      ) : (
        null
      )}
      <br />
    </div>
  );
};

export default CommentInput;

