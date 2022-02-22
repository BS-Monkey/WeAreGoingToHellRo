import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import dateFormat  from 'dateformat';
import { UpvoteButton, DownvoteButton } from './VoteButtons';
import CommentsAndButtons from './CommentAndButtons';
import ReplyAndButtons from './ReplyAndButtons';
import {
  toggleCommentUpvote,
  toggleCommentDownvote,
  toggleReplyUpvote,
  toggleReplyDownvote,
} from '../reducers/postCommentsReducer';
import { notify } from '../reducers/notificationReducer';
import TimeAgo from 'timeago-react';
import getErrorMsg from '../utils/getErrorMsg';

import { 
  Typography, 
  Link, 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableCell, 
  TableBody, 
  TableRow, 
  Avatar, 
} from '@material-ui/core';
import { usePostCommentsStyles } from '../styles/muiStyles';
import ForumIcon from '@material-ui/icons/Forum';
import DeleteDialog from './DeleteDialog';
import { deleteAward } from '../reducers/postCommentsReducer';
import { awardKind } from '../backendUrl';

const AwardsDisplay = ({ awards, postId, isMobile }) => {
  const classes = usePostCommentsStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.user);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteAward = async (id) => {
    try {
      handleClose();
      await dispatch(deleteAward(postId, id));
      dispatch(notify(`Award deleted!`, 'success'));
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <div className={classes.commentsContainer}>
      {awards.length === 0
      ? (
          <div className={classes.noCommentsBanner}>
            <Typography variant="h5" color="secondary">
              No Awards Yet
            </Typography>
          </div>
        )
      : (
          <Paper className={classes.root}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Award</TableCell>
                    <TableCell align="center">AwardName</TableCell>
                    <TableCell align="center">AwardedBy</TableCell>
                    <TableCell align="right">CreatedAt</TableCell>
                    <TableCell align="right">UpdatedAt</TableCell>
                    <TableCell align="center">OPERATION</TableCell>
                  </TableRow>
                </TableHead>
              
                <TableBody>
                  {awards.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row" align="center">
                        <Avatar variant="rounded" alt={awardKind[row.awardBody].awardName} src={awardKind[row.awardBody].imgName}/>
                      </TableCell>
                      <TableCell align="center">{awardKind[row.awardBody].awardName}</TableCell>
                      <TableCell align="center">{row.awardedByName}</TableCell>
                      <TableCell align="right">{dateFormat(row.createdAt, 'yyyy/mm/dd, hh/mm/ss')}</TableCell>
                      <TableCell align="right">{dateFormat(row.updatedAt, 'yyyy/mm/dd, hh/mm/ss')}</TableCell>
                      <TableCell align="center">
                        <DeleteDialog
                          title={awardKind[row.awardBody].awardName}
                          handleDelete={(id) => handleDeleteAward(row.id)}
                          handleMenuClose={handleClose}
                          type='award'
                        />
                      </TableCell>
                    </TableRow>                  
                  ))}
                </TableBody>
              </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

export default AwardsDisplay;
