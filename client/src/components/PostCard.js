import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { UpvoteButton, DownvoteButton } from './VoteButtons';
import { notify } from '../reducers/notificationReducer';
import { getBanState, userReadPost } from '../reducers/userReducer';
import EditDeleteMenu from './EditDeleteMenu';
import getEditedThumbail from '../utils/cloudinaryTransform';
import { trimLink, prettifyLink, fixUrl } from '../utils/formatUrl';
import TimeAgo from 'timeago-react';
import getErrorMsg from '../utils/getErrorMsg';

import {
  Paper,
  Typography,
  useMediaQuery,
  CardMedia,
  Link,
  SvgIcon, 
  Button,
  ListItemIcon, 
  Avatar, 
} from '@material-ui/core';
import { useCardStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import { ReactComponent as PinIcon } from '../svg/pin.svg';
import { ReactComponent as LockIcon } from '../svg/lock.svg';
import MessageIcon from '@material-ui/icons/Message';
import LinkIcon from '@material-ui/icons/Link';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CommentIcon from '@material-ui/icons/Comment';
import { flairKind, cntAwards } from '../backendUrl';

const PostCard = ({ post, toggleUpvote, toggleDownvote }) => {
  const {
    id,
    title,
    postType,
    textSubmission,
    linkSubmission,
    imageSubmission, 
    videoSubmission, 
    author,
    upvotedBy,
    downvotedBy,
    pointsCount,
    awards, 
    commentCount,
    createdAt,
    updatedAt,
    flairSubmission, 
    is_pinned, 
    is_locked, 
  } = post;

  const classes = useCardStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const dispatch = useDispatch();
  const { user, darkMode } = useSelector((state) => state);

  const [ban_state, setBan_state] = useState(false);
  const [ban_user, setBan_user] = useState('');

  useEffect(() => {
    const getBan_state = async () => {
      try {
        if(author) {
          var temp = await dispatch(getBanState(post.author.id));
          setBan_state(temp.ban_state);
          setBan_user(temp.ban_user);
        }          
      } catch (err) {
        dispatch(notify(getErrorMsg(err), 'error'));
      }
    };

    getBan_state();
  }, []);


  const isUpvoted = user && upvotedBy.includes(user.id);
  const isDownvoted = user && downvotedBy.includes(user.id);

  const handleUpvoteToggle = async () => {
    try {
      if (isUpvoted) {
        const updatedUpvotedBy = upvotedBy.filter((u) => u !== user.id);
        dispatch(toggleUpvote(id, updatedUpvotedBy, downvotedBy));
      } else {
        const updatedUpvotedBy = [...upvotedBy, user.id];
        const updatedDownvotedBy = downvotedBy.filter((d) => d !== user.id);
        dispatch(toggleUpvote(id, updatedUpvotedBy, updatedDownvotedBy));
      }
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleDownvoteToggle = async () => {
    try {
      if (isDownvoted) {
        const updatedDownvotedBy = downvotedBy.filter((d) => d !== user.id);
        dispatch(toggleDownvote(id, updatedDownvotedBy, upvotedBy));
      } else {
        const updatedDownvotedBy = [...downvotedBy, user.id];
        const updatedUpvotedBy = upvotedBy.filter((u) => u !== user.id);
        dispatch(toggleDownvote(id, updatedDownvotedBy, updatedUpvotedBy));
      }
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const linkToShow =
    postType === 'Link'
      ? linkSubmission
      : postType === 'Image'
      ? imageSubmission.imageLink
      : '';

  const formattedLink = trimLink(prettifyLink(linkToShow), 30);

  for (let i = 0; i < 24; i ++) {
    cntAwards[i].awardCnt = 0;
  }

  if(post && post.awards && post.awards.length !== 0) {
    for (let i = 0; i < post.awards.length ; i ++) {
      cntAwards[post.awards[i].awardBody].awardCnt ++;
    }
  }

  let isReaded = false;
  if( post && user && user.readposts ) {
    for (let i = 0; i < user.readposts.length; i ++) {
      if(post.id === user.readposts[i]) {
        isReaded = true;
        break;
      }      
    }
  }

  return (
    <Paper className={classes.root} variant="outlined">
      <div className={classes.votesWrapper}>
        <UpvoteButton
          user={user}
          body={post}
          handleUpvote={handleUpvoteToggle}
          size={isMobile ? 'small' : 'medium'}
        />
        <Typography
          variant="body1"
          style={{
            color: isUpvoted
              ? '#FF8b60'
              : isDownvoted
              ? '#9494FF'
              : darkMode
              ? '#e4e4e4'
              : '#333',
            fontWeight: 600,
          }}
        >
          {pointsCount}
        </Typography>
        <DownvoteButton
          user={user}
          body={post}
          handleDownvote={handleDownvoteToggle}
          size={isMobile ? 'small' : 'medium'}
        />
      </div>
      <div className={classes.thumbnailWrapper}>
        {postType === 'Text' ? (
          <a href={`/comments/${id}`}>
            <Paper elevation={0} square className={classes.thumbnail}>
              <MessageIcon
                fontSize="inherit"
                className={classes.thumbnailIcon}
                style={{ color: '#787878' }}
              />
            </Paper>
          </a>
        ) : postType === 'Link' ? (
          <a href={fixUrl(linkSubmission)} target="_noblank">
            <Paper elevation={0} square className={classes.thumbnail}>
              <LinkIcon
                fontSize="inherit"
                className={classes.thumbnailIcon}
                style={{ color: '#787878' }}
              />
            </Paper>
          </a>
        ) : postType === 'Image' ? (
          <Paper elevation={0} square className={classes.thumbnail}>
            <CardMedia
              className={classes.thumbnail}
              image={getEditedThumbail(imageSubmission?.imageLink)}
              title={title}
              component="a"
              href={imageSubmission.imageLink}
              target="_noblank"
            />
          </Paper>
        ) : (
          <Paper elevation={0} square className={classes.thumbnail}>
            <CardMedia
              className={classes.thumbnail}
              src={(videoSubmission?.videoLink)}
              title={title}
              component="video"
              href={videoSubmission.videoLink}
              target="_noblank"
            />
            {/* {isMobile ? (
              <video width="60" height="80" controls style={{marginTop: '0px'}} >
                <source src={videoSubmission.videoLink} type="video/mp4"/>
              </video>
            ) : (
              <video width="70" height="90" controls style={{marginTop: '0px', marginLeft: '0px'}} >
                <source src={videoSubmission.videoLink} type="video/mp4"/>
              </video>
            )} */}            
          </Paper>
        )}
      </div>
      <div className={classes.postInfoWrapper}>
        <Typography variant="h6" className={classes.title}>
          {isReaded
          ? (
              <Link component={RouterLink} to={`/comments/${id}`} style={{opacity: '65%'}}>
                {post.is_pinned && (
                  <SvgIcon fontSize="small" style={{height: '12px'}}>
                    <PinIcon />
                  </SvgIcon>
                )} {' '}
                {post.is_locked && (
                  <SvgIcon fontSize="small" style={{height: '12px'}}>
                    <LockIcon />
                  </SvgIcon>
                )} {' '}
                {title}                    
              </Link>
            )
          : (
              <Link component={RouterLink} to={`/comments/${id}`}>
                {post.is_pinned && (
                  <SvgIcon fontSize="small" style={{height: '12px'}}>
                    <PinIcon />
                  </SvgIcon>
                )} {' '}
                {post.is_locked && (
                  <SvgIcon fontSize="small" style={{height: '12px'}}>
                    <LockIcon />
                  </SvgIcon>
                )} {' '}
                {title}
              </Link>
            )
          }
          {awards.length !== 0 && (
            cntAwards.map((row) => (
              row.awardCnt !== 0 && (
                <ListItemIcon key={row.id}>
                  <Avatar alt="" src={row.awardImg} style={{marginLeft: '15px', width: '0.8em', height: '0.8em'}}/>
                  <Typography variant="subtitle2" style={{marginLeft: '5px', marginRight: '15px', marginTop: '-3px'}}>{row.awardCnt}</Typography>
                </ListItemIcon>
              )
            )))
          }              
          {flairSubmission !== 0 && (
            <Button variant="outlined" style={{height: 'fit-content', marginLeft: '10px', borderRadius: 8}} size="small">{flairKind[flairSubmission].name}</Button>
          )}
        </Typography>
        {author 
          ? ban_state 
            ? user && user.username && user.username === ban_user
              ? (
                  <Typography variant="subtitle2">
                    <Typography variant="caption" className={classes.userAndDate}>
                      Posted by{' '}
                      <a href={`/u/${author.username}`}>
                        u/{author.username}
                      </a>{' '}
                      • <TimeAgo datetime={new Date(createdAt)} />
                      {createdAt !== updatedAt && '*'}
                    </Typography>
                  </Typography>
                )
              : 
                (
                  <Typography variant="subtitle2">
                    <Typography variant="caption" className={classes.userAndDate} style={{textDecoration: 'line-through'}}>
                      Posted by{' '}
                      <Link component={RouterLink} to={`/u/${author.username}`}>
                        u/{author.username}
                      </Link>{' '}
                      • <TimeAgo datetime={new Date(createdAt)} />
                      {createdAt !== updatedAt && '*'}
                    </Typography>
                  </Typography>
                )
            : 
              (
                <Typography variant="subtitle2">
                  <Typography variant="caption" className={classes.userAndDate}>
                    Posted by{' '}
                    <Link component={RouterLink} to={`/u/${author.username}`}>
                      u/{author.username}
                    </Link>{' '}
                    • <TimeAgo datetime={new Date(createdAt)} />
                    {createdAt !== updatedAt && '*'}
                  </Typography>
                </Typography>
              )
          : 
            (
              <Typography variant="subtitle2">
                <Typography variant="caption" className={classes.userAndDate}>
                  • <TimeAgo datetime={new Date(createdAt)} />
                  {createdAt !== updatedAt && '*'}
                </Typography>
              </Typography>
            )
        }
        <div className={classes.bottomBtns}>
          <Button
            startIcon={<CommentIcon />}
            className={classes.commentsBtn}
            component={RouterLink}
            to={`/comments/${id}`}
            size={isMobile ? 'small' : 'medium'}
          >
            {commentCount} comments
          </Button>
          {user && ((author && user.id === author.id) || user.userrole < 3) && (
            <EditDeleteMenu
              id={id}
              isMobile={isMobile}
              title={title}
              postType={postType}
              textSubmission={textSubmission}
              linkSubmission={linkSubmission}
              flairSubmission={flairSubmission}
              is_pinned={is_pinned}
              is_locked={is_locked}
            />
          )}
        </div>
      </div>
    </Paper>          
  );
};

export default PostCard;
