import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addAward } from '../reducers/postCommentsReducer';
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
  FormControl, 
  Select, 
  MenuItem, 
  ListItemIcon, 
  Avatar, 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
} from '@material-ui/core';
import { useCommentInputStyles } from '../styles/muiStyles';
import SendIcon from '@material-ui/icons/Send';
import { awardKind } from '../backendUrl';

const AwardInput = ({ user, postId, post, isMobile }) => {
  const classes = useCommentInputStyles();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [award, setAward] = useState(0); 
  const [canAward, setCanAward] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [awards, setAwards] = useState();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange =  (event) => {
    setAward(event.target.value);
  };

  const handlePostAward = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if(award !== 0) {
        await dispatch(addAward(postId, award));
        setSubmitting(false);
        setCanAward(false);
        dispatch(notify(`Award gived.`, 'success'));
      }
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setCanAward(true);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  useEffect(() => {
    const getAward = async () => {
      try {        
        setAwards(post.awards);
        if (post && post.awards.length !== 0 && user) {
          for (let i = 0; i < post.awards.length; i++) {
            if(user.id === post.awards[i].awardedBy) {
              setAward(post.awards[i].awardBody);
              setCanAward(false);
              break;
            }
          }
        } else {
          setCanAward(true);
          setAward(0);
        }
        
      } catch (err) {
        dispatch(notify(getErrorMsg(err), 'error'));
      }
    };
    getAward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, post]);

  let flag = user && user.username && user.username !== '';
  
  return (
    <div className={classes.wrapper}>
      <br />
      {flag 
      ? (user.id !== post.author.id) && (
          <Typography variant="body2">
            Award as{' '}
            <Link component={RouterLink} to={`/u/${user.username}`}>
              {user.username}
            </Link>
          </Typography>
        )
      : (
        <Typography variant="body1">
          Log in or sign up to give an award
        </Typography>
      )}
      {flag
      ? (user.id !== post.author.id)
        ? (award !== 0 && canAward === false)
          ? (
              <FormControl className={classes.formControl} fullWidth disabled>
              <Select
                id="awardSubmission"
                name="awardSubmission"
                value={award}
                onChange={handleChange}
              >
                {awardKind.map((row) => (
                  <MenuItem key={row.id} value={row.id}>
                    <ListItemIcon>
                      <Avatar variant="rounded" alt={row.awardName} src={row.imgName}/>
                    </ListItemIcon>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            )
          : (
              <FormControl className={classes.formControl} fullWidth>
            <Select
              id="awardSubmission"
              name="awardSubmission"
              value={award}
              onChange={handleChange}
            >
              {awardKind.map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  <ListItemIcon>
                    <Avatar variant="rounded" alt={row.awardName} src={row.imgName}/>
                  </ListItemIcon>
                </MenuItem>
              ))}
            </Select>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.commentBtn}
              startIcon={<SendIcon />}
              size={isMobile ? 'small' : 'medium'}
              disabled={!flag || submitting}
              onClick={handlePostAward}
            >
              {!flag ? 'Login to  award' : submitting ? 'Awarding' : 'Add Award'}
            </Button>
          </FormControl>
            )
        : (
            null
          )
      : (
          <FormControl className={classes.formControl} fullWidth disabled>
          <Select
            id="awardSubmission"
            name="awardSubmission"
            value={award}
            onChange={handleChange}
          >
            {awardKind.map((row) => (
              <MenuItem key={row.id} value={row.id}>
                <ListItemIcon>
                  <Avatar variant="rounded" alt={row.awardName} src={row.imgName}/>
                </ListItemIcon>
              </MenuItem>
            ))}
          </Select>
        </FormControl>        
        )
      }
    </div>
  );
};

export default AwardInput;

