import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPostComments,
  toggleUpvote,
  toggleDownvote, 
} from '../reducers/postCommentsReducer';
import { userReadPost } from '../reducers/userReducer';
import { notify } from '../reducers/notificationReducer';
import CommentInput from './CommentInput';
import AwardInput from './AwardInput';
import { UpvoteButton, DownvoteButton } from './VoteButtons';
import AuthFormModal from './AuthFormModal';
import EditDeleteMenu from './EditDeleteMenu';
import CommentsDisplay from './CommentsDisplay';
import AwardsDisplay from './AwardsDisplay';
import SortCommentsMenu from './SortCommentsMenu';
import ErrorPage from './ErrorPage';
import LoadingSpinner from './LoadingSpinner';
import TimeAgo from 'timeago-react';
import { trimLink, prettifyLink, fixUrl } from '../utils/formatUrl';
import ReactHtmlParser from 'react-html-parser';
import getErrorMsg from '../utils/getErrorMsg';
import Avatar from '@material-ui/core/Avatar';

import {
  Container,
  Paper,
  useMediaQuery,
  Typography,
  Link,
  MenuItem,
  ListItemIcon,
  Divider,
  Button, 
} from '@material-ui/core';
import { usePostCommentsStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CommentIcon from '@material-ui/icons/Comment';
import { flairKind, cntAwards } from '../backendUrl';

const PostCommentsPage = () => {
  const { id: postId } = useParams();
  const post = useSelector((state) => state.postComments);

  const { user, darkMode } = useSelector((state) => state);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const getComments = async () => {
      try {
        // await dispatch(userReadPost(postId));
        await dispatch(fetchPostComments(postId));
        setPageLoading(false);
      } catch (err) {
        setPageError(getErrorMsg(err));
      }
    };
    // console.log(postId);
    if (user?.token !== '') {
      dispatch(userReadPost(postId));
    } else {
    }
    getComments();
  }, [postId]);

  for (let i = 0; i < cntAwards.length; i ++) {
    cntAwards[i].awardCnt = 0;
  }

  if(post && post.awards && post.awards.length !== 0) {
    for (let i = 0; i < post.awards.length ; i ++) {
      cntAwards[post.awards[i].awardBody].awardCnt ++;
    }
  }

  const classes = usePostCommentsStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  if (pageError) {
    return (
      <Container disableGutters>
        <Paper variant="outlined" className={classes.mainPaper}>
          <ErrorPage errorMsg={pageError} />
        </Paper>
      </Container>
    );
  }

  if (!post || pageLoading) {
    return (
      <Container disableGutters>
        <Paper variant="outlined" className={classes.mainPaper}>
          <LoadingSpinner text={'Fetching post comments...'} />
        </Paper>
      </Container>
    );
  }

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
    comments,
    commentCount,
    awards, 
    createdAt,
    updatedAt,
    flairSubmission, 
    is_pinned, 
    is_locked,
  } = post;


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

  const formattedLink =
    postType === 'Link' && trimLink(prettifyLink(linkSubmission), 70);

  return (
    <Container disableGutters>
      <Paper variant="outlined" className={classes.mainPaper}>
        <div className={classes.topPortion}>
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
          <div className={classes.postDetails}>
            <Typography variant="subtitle2">
              {
                author ? 
                (
                  <Typography variant="caption" className={classes.userAndDate}>
                    • Posted by
                    <Link component={RouterLink} to={`/u/${author.username}`}>
                      {` u/${author.username} `}
                    </Link>
                    • <TimeAgo datetime={new Date(createdAt)} />
                    {createdAt !== updatedAt && (
                      <em>
                        {' • edited'} <TimeAgo datetime={new Date(updatedAt)} />
                      </em>
                    )}
                  </Typography>
                ) : (
                  <Typography variant="caption" className={classes.userAndDate}>
                    • <TimeAgo datetime={new Date(createdAt)} />
                    {createdAt !== updatedAt && (
                      <em>
                        {' • edited'} <TimeAgo datetime={new Date(updatedAt)} />
                      </em>
                    )}
                  </Typography>
                )
              }              
            </Typography>
            {!isMobile ? (
              <Typography variant="h5" className={classes.title}>
                <MenuItem className={classes.bottomButton}>                
                  <span style={{ fontFamily: 'inherit', whiteSpace: 'pre-line', lineBreak: 'auto' }}>{title}</span>
                  {awards.length === 0 
                  ? (
                      null
                    )
                  : (
                      cntAwards.map((row) => (
                        row.awardCnt !== 0 && (
                          <ListItemIcon key={row.id}>
                            <Avatar alt="" src={row.awardImg} style={{marginLeft: '25px', width: '1.5em', height: '1.5em'}}/>
                            <Typography variant="h6" style={{marginLeft: '10px', marginTop: '-3px', marginRight: '5px'}}>{row.awardCnt}</Typography>
                          </ListItemIcon>
                        )
                      ))
                    )
                  }
                  {post && post.flairSubmission !== 0 && (
                    <Button variant="outlined" style={{marginLeft: '10px', borderRadius: 10}}>{flairKind[flairSubmission].name}</Button>
                  )}
                </MenuItem>
              </Typography>
            ) : (
              <>
                <Typography variant="h5" className={classes.title}>
                  <span style={{ fontFamily: 'inherit', whiteSpace: 'pre-line', lineBreak: 'auto' }}>{title}</span>
                </Typography>
                <Typography variant="h5" className={classes.title}>
                  {awards.length === 0 
                  ? (
                      null
                    )
                  : (
                      cntAwards.map((row) => (
                        row.awardCnt !== 0 && (
                          <ListItemIcon key={row.id}>
                            <Avatar alt="" src={row.awardImg} style={{marginLeft: '25px', width: '1.5em', height: '1.5em'}}/>
                            <Typography variant="h6" style={{marginLeft: '10px', marginTop: '-3px', marginRight: '5px'}}>{row.awardCnt}</Typography>
                          </ListItemIcon>
                        )
                      ))
                    )
                  }
                </Typography>
                <Typography>
                  {post && post.flairSubmission !== 0 && (
                    <Button variant="outlined" style={{marginLeft: '10px', marginBottom: '15px', borderRadius: 10}}>{flairKind[flairSubmission].name}</Button>
                  )}
                </Typography>
              </>
            )}
            {postType === 'Text' ? (
              <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-line', lineBreak: 'auto' }}>
                {ReactHtmlParser(textSubmission)}
              </pre>
            ) : postType === 'Image' ? (
              <a
                href={imageSubmission.imageLink}
                alt={title}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.imagePost}
              >
                <img
                  alt={title}
                  src={imageSubmission.imageLink}
                  className={classes.image}
                />
              </a>
            ) : postType === 'Video' ? (
              <a
                // href={videoSubmission.videoLink}
                alt={title}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.imagePost}
              >
                {isMobile ? (
                  <video width="200px" controls>
                    <source src={videoSubmission.videoLink} type="video/mp4"/>
                  </video>
                ) : (
                  <video width="400px" controls>
                    <source src={videoSubmission.videoLink} type="video/mp4"/>
                  </video>
                )}    
              </a>
            ) : (
              <Link href={fixUrl(linkSubmission)}>
                {formattedLink} <OpenInNewIcon fontSize="inherit" />
              </Link>
            )}
            <div className={classes.bottomBar}>
              <MenuItem className={classes.bottomButton}>
                <ListItemIcon>
                  <CommentIcon className={classes.commentIcon} />
                  <Typography variant="subtitle2">{commentCount}</Typography>
                </ListItemIcon>
              </MenuItem>
              {(user?.id === author?.id) || ((user && user.userrole === 1) || (user && user.userrole === 2)) 
              ? (
                <EditDeleteMenu
                  id={id}
                  isMobile={isMobile}
                  title={title}
                  postType={postType}
                  buttonType="buttonGroup"
                  textSubmission={textSubmission}
                  linkSubmission={linkSubmission}
                  flairSubmission={flairSubmission}
                  is_pinned={is_pinned}
                  is_locked={is_locked}
                />
                )
              : (
                  null
                )}
            </div>
            {
              (is_pinned || is_locked) 
              ? user && user.userrole && user.userrole < 3 && (
                <>
                  <CommentInput user={user} postId={id} post={post} isMobile={isMobile} />
                  <AwardInput user={user} postId={id} post={post} isMobile={isMobile} />
                  <SortCommentsMenu />
                </>
                )
              : 
                (
                  <>
                    <CommentInput user={user} postId={id} post={post} isMobile={isMobile} />
                    <AwardInput user={user} postId={id} post={post} isMobile={isMobile} />
                    <SortCommentsMenu />
                  </>
                )
            }
          </div>
        </div>
        <Divider className={classes.divider} />
        <CommentsDisplay comments={comments} postId={id} isMobile={isMobile} />
        {user && user.userrole === 1 && (
          <AwardsDisplay awards={awards} postId={id} isMobile={isMobile} />
        )}
      </Paper>
    </Container>
  );
};

export default PostCommentsPage;
