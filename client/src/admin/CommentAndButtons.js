import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addReply,
  editComment,
  realDeleteComment,
} from '../reducers/postCommentsReducer';
import { notify } from '../reducers/notificationReducer';
import DeleteDialog from './DeleteDialog';
import getErrorMsg from '../utils/getErrorMsg';

import { 
  TextField, 
  Button, 
  Typography, 
  useMediaQuery, 
} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';
import { useCommentAndBtnsStyles } from '../styles/muiStyles';
import ReplyIcon from '@material-ui/icons/Reply';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import { blacklistWords } from '../backendUrl';

const CommentAndButtons = ({ isMobile, comment, postId, user }) => {
  const classes = useCommentAndBtnsStyles();
  const dispatch = useDispatch();
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [editInput, setEditInput] = useState(comment.commentBody);
  const [submitting, setSubmitting] = useState(false);

  const handlePostReply = async () => {
    if (replyInput.length > 3000) {
      alert('reply to a comment must be less than 3000 characters.');
      return;
    }
    for (let i = 0; i < blacklistWords.length; i ++) {
      if (replyInput.includes(blacklistWords[i])) {
        alert('You can not type the words ' + `'${blacklistWords[i]}'`);
        return false;
      }
    }
    try {
      setSubmitting(true);
      await dispatch(addReply(postId, comment.id, replyInput));
      setSubmitting(false);
      setReplyOpen(false);
      setReplyInput('');
      dispatch(notify(`Reply submitted!`, 'success'));
    } catch (err) {
      setSubmitting(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleEditComment = async () => {
    if (editInput.length > 3000) {
      alert('reply to a comment must be less than 3000 characters.');
      return;
    }
    for (let i = 0; i < blacklistWords.length; i ++) {
      if (editInput.includes(blacklistWords[i])) {
        alert('You can not type the words ' + `'${blacklistWords[i]}'`);
        return false;
      }
    }
    try {
      setSubmitting(true);
      await dispatch(editComment(postId, comment.id, editInput));
      setSubmitting(false);
      setEditOpen(false);
      dispatch(notify(`Comment edited!`, 'success'));
    } catch (err) {
      setSubmitting(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleCommentDelete = async () => {
    try {
      await dispatch(realDeleteComment(postId, comment.id));
      dispatch(notify(`Comment deleted!`, 'success'));
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <div>
      {!editOpen 
      ? comment.is_deleted 
        ? (
            <Typography variant="body2">[removed]</Typography>
          ) 
        : (
            <Typography variant="body2">{comment.commentBody}</Typography>
          ) 
      : (
        <div className={classes.inputDiv}>
          <TextField
            multiline
            fullWidth
            rows={2}
            rowsMax={Infinity}
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
          />
          <div className={classes.submitBtns}>
            <Button
              onClick={() => setEditOpen(false)}
              color="primary"
              variant="outlined"
              size="small"
              className={classes.cancelBtn}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditComment}
              color="primary"
              variant="contained"
              startIcon={<SendIcon />}
              size="small"
              disabled={submitting}
            >
              {submitting ? 'Updating' : 'Update'}
            </Button>
          </div>
        </div>
      )}
      <div className={classes.btnBar}>
        {user && user.username && user.username !== '' && (
          <Button
            size="small"
            color="inherit"
            startIcon={<ReplyIcon />}
            className={classes.btnStyle}
            onClick={() => setReplyOpen((prevState) => !prevState)}
          >
            {!isMobile && ('Reply')}
          </Button>
        )}
        {((user && user.id === comment.commentedBy.id) || (user.userrole === 1 || user.userrole === 2)) && (
          <>
            <Button
              size="small"
              color="inherit"
              startIcon={<EditIcon />}
              className={classes.btnStyle}
              onClick={() => setEditOpen((prevState) => !prevState)}
            >
              {!isMobile && ('Edit')}
            </Button>
            <DeleteDialog type="comment" handleDelete={handleCommentDelete} />
          </>
        )}
      </div>
      {replyOpen && (
        <div className={classes.inputDiv}>
          <TextField
            placeholder={`Reply to ${comment.commentedBy.username}'s comment`}
            multiline
            required
            fullWidth
            rows={4}
            rowsMax={Infinity}
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
          />
          <div className={classes.submitBtns}>
            <Button
              onClick={() => setReplyOpen(false)}
              color="primary"
              variant="outlined"
              size="small"
              className={classes.cancelBtn}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostReply}
              color="primary"
              variant="contained"
              startIcon={<SendIcon />}
              size="small"
              disabled={submitting}
            >
              {submitting ? 'Replying' : 'Reply'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentAndButtons;
