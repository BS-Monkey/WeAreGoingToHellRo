import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
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

import { Typography, Link } from '@material-ui/core';
import { usePostCommentsStyles } from '../styles/muiStyles';
import ForumIcon from '@material-ui/icons/Forum';

const CommentsDisplay = ({ comments, postId, isMobile }) => {
  const classes = usePostCommentsStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleCommentUpvote = async (commentId) => {
    const { upvotedBy, downvotedBy } = comments.find((c) => c.id === commentId);

    try {
      if (upvotedBy.includes(user.id)) {
        const updatedUpvotedBy = upvotedBy.filter((u) => u !== user.id);
        dispatch(
          toggleCommentUpvote(postId, commentId, updatedUpvotedBy, downvotedBy)
        );
      } else {
        const updatedUpvotedBy = [...upvotedBy, user.id];
        const updatedDownvotedBy = downvotedBy.filter((d) => d !== user.id);
        dispatch(
          toggleCommentUpvote(
            postId,
            commentId,
            updatedUpvotedBy,
            updatedDownvotedBy
          )
        );
      }
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleCommentDownvote = async (commentId) => {
    const { upvotedBy, downvotedBy } = comments.find((c) => c.id === commentId);

    try {
      if (downvotedBy.includes(user.id)) {
        const updatedDownvotedBy = downvotedBy.filter((d) => d !== user.id);
        dispatch(
          toggleCommentDownvote(
            postId,
            commentId,
            updatedDownvotedBy,
            upvotedBy
          )
        );
      } else {
        const updatedDownvotedBy = [...downvotedBy, user.id];
        const updatedUpvotedBy = upvotedBy.filter((u) => u !== user.id);
        dispatch(
          toggleCommentDownvote(
            postId,
            commentId,
            updatedDownvotedBy,
            updatedUpvotedBy
          )
        );
      }
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const commentDetails = (by, comment) => {
    return (
      <>
        <Typography variant="caption">
          <Link component={RouterLink} to={`/u/${by.username}`}>
            {by.username}
          </Link>
          {` ${comment.pointsCount} ${
            comment.pointsCount === 1 ? 'point' : 'points'
          } • `}
          <TimeAgo datetime={new Date(comment.createdAt)} />
          {comment.createdAt !== comment.updatedAt && (
            <em>
              {' • edited'} <TimeAgo datetime={new Date(comment.updatedAt)} />
            </em>
          )}
        </Typography>
      </>
    );
  };

  const [displayComments, setDisplayComments] = useState([]);

  useEffect(() => {
    let cnt = 0;

    let displayComment = [];
    for (let i = 0; i < comments.length; i ++) {
      if(comments[i].parentId.parentType === 'Post') {
        displayComment.push({
          id: comments[i].id, 
          is_deleted: comments[i].is_deleted, 
          upvotedBy: comments[i].upvotedBy, 
          downvotedBy: comments[i].downvotedBy, 
          commentedBy: comments[i].commentedBy, 
          commentBody: comments[i].commentBody, 
          pointsCount: comments[i].pointsCount, 
          createdAt: comments[i].createdAt, 
          updatedAt: comments[i].updatedAt, 
        });
        cnt ++;
      }
    }
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      displayComment[i].children = [];
      for (let j = 0; j < comments.length; j ++) {
        if(comments[j].commentLvl === 1)
        {
          if(comments[j].parentId.parentId === displayComment[i].id) {
            displayComment[i].children.push({
              id: comments[j].id, 
              is_deleted: comments[j].is_deleted, 
              upvotedBy: comments[j].upvotedBy, 
              downvotedBy: comments[j].downvotedBy, 
              commentedBy: comments[j].commentedBy, 
              commentBody: comments[j].commentBody, 
              pointsCount: comments[j].pointsCount, 
              createdAt: comments[j].createdAt, 
              updatedAt: comments[j].updatedAt, 
            });
            cnt ++;
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        displayComment[i].children[j].children = [];
        for (let k = 0; k < comments.length; k ++) {
          if(comments[k].commentLvl === 2) {
            if(comments[k].parentId.parentId === displayComment[i].children[j].id) {
              displayComment[i].children[j].children.push({                
                id: comments[k].id, 
                is_deleted: comments[k].is_deleted, 
                upvotedBy: comments[k].upvotedBy, 
                downvotedBy: comments[k].downvotedBy, 
                commentedBy: comments[k].commentedBy, 
                commentBody: comments[k].commentBody, 
                pointsCount: comments[k].pointsCount, 
                createdAt: comments[k].createdAt, 
                updatedAt: comments[k].updatedAt, 
              });
              cnt ++;
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        for(let k = 0; k < displayComment[i].children[j].children.length; k ++) {
          displayComment[i].children[j].children[k].children = [];
          for(let a = 0; a < comments.length; a ++) {
            if(comments[a].commentLvl === 3) {
              if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].id) {
                displayComment[i].children[j].children[k].children.push({                
                  id: comments[a].id, 
                  is_deleted: comments[a].is_deleted, 
                  upvotedBy: comments[a].upvotedBy, 
                  downvotedBy: comments[a].downvotedBy, 
                  commentedBy: comments[a].commentedBy, 
                  commentBody: comments[a].commentBody, 
                  pointsCount: comments[a].pointsCount, 
                  createdAt: comments[a].createdAt, 
                  updatedAt: comments[a].updatedAt, 
              });
              cnt ++;
              }
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
          for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
            displayComment[i].children[j].children[k].children[l].children = [];
            for(let a = 0; a < comments.length; a ++) {
              if(comments[a].commentLvl === 4) {
                if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].id) {
                  displayComment[i].children[j].children[k].children[l].children.push({                
                    id: comments[a].id, 
                    is_deleted: comments[a].is_deleted, 
                    upvotedBy: comments[a].upvotedBy, 
                    downvotedBy: comments[a].downvotedBy, 
                    commentedBy: comments[a].commentedBy, 
                    commentBody: comments[a].commentBody, 
                    pointsCount: comments[a].pointsCount, 
                    createdAt: comments[a].createdAt, 
                    updatedAt: comments[a].updatedAt, 
                });
                cnt ++;
                }
              }
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
          for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
            for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
              displayComment[i].children[j].children[k].children[l].children[m].children = [];
              for(let a = 0; a < comments.length; a ++) {
                if(comments[a].commentLvl === 5) {
                  if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].id) {
                    displayComment[i].children[j].children[k].children[l].children[m].children.push({                
                      id: comments[a].id, 
                      is_deleted: comments[a].is_deleted, 
                      upvotedBy: comments[a].upvotedBy, 
                      downvotedBy: comments[a].downvotedBy, 
                      commentedBy: comments[a].commentedBy, 
                      commentBody: comments[a].commentBody, 
                      pointsCount: comments[a].pointsCount, 
                      createdAt: comments[a].createdAt, 
                      updatedAt: comments[a].updatedAt, 
                  });
                  cnt ++;
                  }
                }
              }
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
          for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
            for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
              for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
                displayComment[i].children[j].children[k].children[l].children[m].children[n].children = [];
                for(let a = 0; a < comments.length; a ++) {
                  if(comments[a].commentLvl === 6) {
                    if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].id) {
                      displayComment[i].children[j].children[k].children[l].children[m].children[n].children.push({                
                        id: comments[a].id, 
                        is_deleted: comments[a].is_deleted, 
                        upvotedBy: comments[a].upvotedBy, 
                        downvotedBy: comments[a].downvotedBy, 
                        commentedBy: comments[a].commentedBy, 
                        commentBody: comments[a].commentBody, 
                        pointsCount: comments[a].pointsCount, 
                        createdAt: comments[a].createdAt, 
                        updatedAt: comments[a].updatedAt, 
                    });
                    cnt ++;
                    }
                  }
                }
              }              
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
          for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
            for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
              for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
                for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
                  displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children = [];
                  for(let a = 0; a < comments.length; a ++) {
                    if(comments[a].commentLvl === 7) {
                      if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].id) {
                        displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.push({                
                          id: comments[a].id, 
                          is_deleted: comments[a].is_deleted, 
                          upvotedBy: comments[a].upvotedBy, 
                          downvotedBy: comments[a].downvotedBy, 
                          commentedBy: comments[a].commentedBy, 
                          commentBody: comments[a].commentBody, 
                          pointsCount: comments[a].pointsCount, 
                          createdAt: comments[a].createdAt, 
                          updatedAt: comments[a].updatedAt, 
                      });
                      cnt ++;
                      }
                    }
                  }
                }
              }              
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
          for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
            for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
              for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
                for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
                  for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
                    displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children = [];
                    for(let a = 0; a < comments.length; a ++) {
                      if(comments[a].commentLvl === 8) {
                        if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].id) {
                          displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.push({                
                            id: comments[a].id, 
                            is_deleted: comments[a].is_deleted, 
                            upvotedBy: comments[a].upvotedBy, 
                            downvotedBy: comments[a].downvotedBy, 
                            commentedBy: comments[a].commentedBy, 
                            commentBody: comments[a].commentBody, 
                            pointsCount: comments[a].pointsCount, 
                            createdAt: comments[a].createdAt, 
                            updatedAt: comments[a].updatedAt, 
                        });
                        cnt ++;
                        }
                      }
                    }
                  }
                }
              }              
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    for (let i = 0; i < displayComment.length; i ++) {
      for (let j = 0; j < displayComment[i].children.length; j ++) {
        for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
          for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
            for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
              for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
                for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
                  for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
                    for (let q = 0; q < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.length; q ++) {
                      displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children = [];
                      for(let a = 0; a < comments.length; a ++) {
                        if(comments[a].commentLvl === 9) {
                          if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].id) {
                            displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children.push({                
                              id: comments[a].id, 
                              is_deleted: comments[a].is_deleted, 
                              upvotedBy: comments[a].upvotedBy, 
                              downvotedBy: comments[a].downvotedBy, 
                              commentedBy: comments[a].commentedBy, 
                              commentBody: comments[a].commentBody, 
                              pointsCount: comments[a].pointsCount, 
                              createdAt: comments[a].createdAt, 
                              updatedAt: comments[a].updatedAt, 
                          });
                          cnt ++;
                          }
                        }
                      }
                    }
                  }
                }
              }              
            }
          }
        }
      }
    }    
    if(cnt === comments.length){
      setDisplayComments(displayComment);
      return;
    }

    // for (let i = 0; i < displayComment.length; i ++) {
    //   for (let j = 0; j < displayComment[i].children.length; j ++) {
    //     for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
    //       for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
    //         for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
    //           for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
    //             for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
    //               for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
    //                 for (let q = 0; q < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.length; q ++) {
    //                   for (let r = 0; r < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children.length; r ++) {
    //                     displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children = [];
    //                     for(let a = 0; a < comments.length; a ++) {
    //                       if(comments[a].commentLvl === 10) {
    //                         if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].id) {
    //                           displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children.push({                
    //                             id: comments[a].id, 
    //                             is_deleted: comments[a].is_deleted, 
    //                             upvotedBy: comments[a].upvotedBy, 
    //                             downvotedBy: comments[a].downvotedBy, 
    //                             commentedBy: comments[a].commentedBy, 
    //                             commentBody: comments[a].commentBody, 
    //                             pointsCount: comments[a].pointsCount, 
    //                             createdAt: comments[a].createdAt, 
    //                             updatedAt: comments[a].updatedAt, 
    //                         });
    //                         cnt ++;
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }              
    //         }
    //       }
    //     }
    //   }
    // }    
    // if(cnt === comments.length){
    //   setDisplayComments(displayComment);
    //   return;
    // }
    // console.log(cnt);

    // for (let i = 0; i < displayComment.length; i ++) {
    //   for (let j = 0; j < displayComment[i].children.length; j ++) {
    //     for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
    //       for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
    //         for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
    //           for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
    //             for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
    //               for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
    //                 for (let q = 0; q < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.length; q ++) {
    //                   for (let r = 0; r < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children.length; r ++) {
    //                     for (let s = 0; s < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children.length; s ++) {
    //                       displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children = [];
    //                       for(let a = 0; a < comments.length; a ++) {
    //                         if(comments[a].commentLvl === 11) {
    //                           if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].id) {
    //                             displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children.push({                
    //                               id: comments[a].id, 
    //                               is_deleted: comments[a].is_deleted, 
    //                               upvotedBy: comments[a].upvotedBy, 
    //                               downvotedBy: comments[a].downvotedBy, 
    //                               commentedBy: comments[a].commentedBy, 
    //                               commentBody: comments[a].commentBody, 
    //                               pointsCount: comments[a].pointsCount, 
    //                               createdAt: comments[a].createdAt, 
    //                               updatedAt: comments[a].updatedAt, 
    //                           });
    //                           cnt ++;
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }              
    //         }
    //       }
    //     }
    //   }
    // }    
    // if(cnt === comments.length){
    //   setDisplayComments(displayComment);
    //   return;
    // }
    // console.log(cnt);

    // for (let i = 0; i < displayComment.length; i ++) {
    //   for (let j = 0; j < displayComment[i].children.length; j ++) {
    //     for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
    //       for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
    //         for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
    //           for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
    //             for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
    //               for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
    //                 for (let q = 0; q < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.length; q ++) {
    //                   for (let r = 0; r < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children.length; r ++) {
    //                     for (let s = 0; s < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children.length; s ++) {
    //                       for (let t = 0; t < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children.length; t ++) {
    //                         displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children = [];
    //                         for(let a = 0; a < comments.length; a ++) {
    //                           if(comments[a].commentLvl === 12) {
    //                             if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].id) {
    //                               displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children.push({                
    //                                 id: comments[a].id, 
    //                                 is_deleted: comments[a].is_deleted, 
    //                                 upvotedBy: comments[a].upvotedBy, 
    //                                 downvotedBy: comments[a].downvotedBy, 
    //                                 commentedBy: comments[a].commentedBy, 
    //                                 commentBody: comments[a].commentBody, 
    //                                 pointsCount: comments[a].pointsCount, 
    //                                 createdAt: comments[a].createdAt, 
    //                                 updatedAt: comments[a].updatedAt, 
    //                             });
    //                             cnt ++;
    //                             }
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }              
    //         }
    //       }
    //     }
    //   }
    // }    
    // if(cnt === comments.length){
    //   setDisplayComments(displayComment);
    //   return;
    // }
    // console.log(cnt);

    // for (let i = 0; i < displayComment.length; i ++) {
    //   for (let j = 0; j < displayComment[i].children.length; j ++) {
    //     for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
    //       for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
    //         for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
    //           for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
    //             for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
    //               for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
    //                 for (let q = 0; q < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.length; q ++) {
    //                   for (let r = 0; r < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children.length; r ++) {
    //                     for (let s = 0; s < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children.length; s ++) {
    //                       for (let t = 0; t < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children.length; t ++) {
    //                         for (let u = 0; u < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children.length; u ++) {
    //                           displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children = [];
    //                           for(let a = 0; a < comments.length; a ++) {
    //                             if(comments[a].commentLvl === 13) {
    //                               if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].id) {
    //                                 displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children.push({                
    //                                   id: comments[a].id, 
    //                                   is_deleted: comments[a].is_deleted, 
    //                                   upvotedBy: comments[a].upvotedBy, 
    //                                   downvotedBy: comments[a].downvotedBy, 
    //                                   commentedBy: comments[a].commentedBy, 
    //                                   commentBody: comments[a].commentBody, 
    //                                   pointsCount: comments[a].pointsCount, 
    //                                   createdAt: comments[a].createdAt, 
    //                                   updatedAt: comments[a].updatedAt, 
    //                               });
    //                               cnt ++;
    //                               }
    //                             }
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }              
    //         }
    //       }
    //     }
    //   }
    // }    
    // if(cnt === comments.length){
    //   setDisplayComments(displayComment);
    //   return;
    // }
    // console.log(cnt);

    // for (let i = 0; i < displayComment.length; i ++) {
    //   for (let j = 0; j < displayComment[i].children.length; j ++) {
    //     for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
    //       for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
    //         for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
    //           for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
    //             for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
    //               for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
    //                 for (let q = 0; q < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.length; q ++) {
    //                   for (let r = 0; r < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children.length; r ++) {
    //                     for (let s = 0; s < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children.length; s ++) {
    //                       for (let t = 0; t < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children.length; t ++) {
    //                         for (let u = 0; u < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children.length; u ++) {
    //                           for (let v = 0; v < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children.length; v ++) {
    //                             displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children[v].children = [];
    //                             for(let a = 0; a < comments.length; a ++) {
    //                               if(comments[a].commentLvl === 14) {
    //                                 if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children[v].id) {
    //                                   displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children[v].children.push({                
    //                                     id: comments[a].id, 
    //                                     is_deleted: comments[a].is_deleted, 
    //                                     upvotedBy: comments[a].upvotedBy, 
    //                                     downvotedBy: comments[a].downvotedBy, 
    //                                     commentedBy: comments[a].commentedBy, 
    //                                     commentBody: comments[a].commentBody, 
    //                                     pointsCount: comments[a].pointsCount, 
    //                                     createdAt: comments[a].createdAt, 
    //                                     updatedAt: comments[a].updatedAt, 
    //                                 });
    //                                 cnt ++;
    //                                 }
    //                               }
    //                             }
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }              
    //         }
    //       }
    //     }
    //   }
    // }    
    // if(cnt === comments.length){
    //   setDisplayComments(displayComment);
    //   return;
    // }
    // console.log(cnt);

    // for (let i = 0; i < displayComment.length; i ++) {
    //   for (let j = 0; j < displayComment[i].children.length; j ++) {
    //     for (let k = 0; k < displayComment[i].children[j].children.length; k ++) {
    //       for (let l = 0; l < displayComment[i].children[j].children[k].children.length; l ++) {
    //         for (let m = 0; m < displayComment[i].children[j].children[k].children[l].children.length; m ++) {
    //           for (let n = 0; n < displayComment[i].children[j].children[k].children[l].children[m].children.length; n ++) {
    //             for (let o = 0; o < displayComment[i].children[j].children[k].children[l].children[m].children[n].children.length; o ++) {
    //               for (let p = 0; p < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children.length; p ++) {
    //                 for (let q = 0; q < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children.length; q ++) {
    //                   for (let r = 0; r < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children.length; r ++) {
    //                     for (let s = 0; s < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children.length; s ++) {
    //                       for (let t = 0; t < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children.length; t ++) {
    //                         for (let u = 0; u < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children.length; u ++) {
    //                           for (let v = 0; v < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children.length; v ++) {
    //                             for (let w = 0; w < displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children[v].children.length; w ++) {
    //                               displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children[v].children[w].children = [];
    //                               for(let a = 0; a < comments.length; a ++) {
    //                                 if(comments[a].commentLvl === 15) {
    //                                   if(comments[a].parentId.parentId === displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children[v].children[w].id) {
    //                                     displayComment[i].children[j].children[k].children[l].children[m].children[n].children[o].children[p].children[q].children[r].children[s].children[t].children[u].children[v].children[w].children.push({                
    //                                       id: comments[a].id, 
    //                                       is_deleted: comments[a].is_deleted, 
    //                                       upvotedBy: comments[a].upvotedBy, 
    //                                       downvotedBy: comments[a].downvotedBy, 
    //                                       commentedBy: comments[a].commentedBy, 
    //                                       commentBody: comments[a].commentBody, 
    //                                       pointsCount: comments[a].pointsCount, 
    //                                       createdAt: comments[a].createdAt, 
    //                                       updatedAt: comments[a].updatedAt, 
    //                                   });
    //                                   cnt ++;
    //                                   }
    //                                 }
    //                               }
    //                             }
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }              
    //         }
    //       }
    //     }
    //   }
    // }    
    // if(cnt === comments.length){
    //   setDisplayComments(displayComment);
    //   return;
    // }
    // console.log(cnt);

    setDisplayComments(displayComment);

    
  }, [comments]);

  return (
    <div className={classes.commentsContainer} style={{overflowX: 'scroll'}} >
      {displayComments?.length !== 0 ? (
        displayComments.map((c, index) => (
          <div key={index} className={classes.wholeComment}>
            {c.is_deleted ? (
              <Typography variant="caption">
                <Link component={RouterLink} to={`/u/${c.username}`}>
                  {c.username}
                </Link>
                <TimeAgo datetime={new Date(c.createdAt)} />
                {c.createdAt !== classes.updatedAt && (
                  <em>
                    {' • edited'} <TimeAgo datetime={new Date(c.updatedAt)} />
                  </em>
                )}                     
                <Typography variant="body2">[removed]</Typography>
              </Typography>
            ) : (
              <div className={classes.commentWrapper}>
                <div className={classes.commentVotesWrapper}>
                  <UpvoteButton
                    user={user}
                    body={c}
                    handleUpvote={() => handleCommentUpvote(c.id)}
                  />
                  <DownvoteButton
                    user={user}
                    body={c}
                    handleDownvote={() => handleCommentDownvote(c.id)}
                  />
                </div>
                <div className={classes.commentDetails}>
                  {commentDetails(c.commentedBy, c)}
                  <CommentsAndButtons
                    isMobile={isMobile}
                    comment={c}
                    postId={postId}
                    user={user}
                  />
                </div>
              </div>
            )}
            {(c.children && c.children.length !== 0) && (
              c.children.map((r) => (
                <div key={r.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                  {r.is_deleted ? (
                    <Typography variant="caption">
                      <Link component={RouterLink} to={`/u/${r.username}`}>
                        {r.username}
                      </Link>
                      <TimeAgo datetime={new Date(r.createdAt)} />
                      {r.createdAt !== r.updatedAt && (
                        <em>
                          {' • edited'} <TimeAgo datetime={new Date(r.updatedAt)} />
                        </em>
                      )}                     
                      <Typography variant="body2">[removed]</Typography>
                    </Typography>
                  ) : (
                    <div className={classes.commentWrapper}>
                      <div className={classes.commentVotesWrapper}>
                        <UpvoteButton
                          user={user}
                          body={r}
                          handleUpvote={() => handleCommentUpvote(r.id)}
                        />
                        <DownvoteButton
                          user={user}
                          body={r}
                          handleDownvote={() => handleCommentDownvote(r.id)}
                        />
                      </div>
                      <div className={classes.commentDetails}>
                        {commentDetails(r.commentedBy, r)}
                        <CommentsAndButtons
                          isMobile={isMobile}
                          comment={r}
                          postId={postId}
                          user={user}
                        />
                      </div>
                    </div>
                  )}
                  {(r.children && r.children.length !== 0) && (
                    r.children.map((a) => (
                      <div key={a.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                        {a.is_deleted ? (
                          <Typography variant="caption">
                            <Link component={RouterLink} to={`/u/${a.username}`}>
                              {a.username}
                            </Link>
                            <TimeAgo datetime={new Date(a.createdAt)} />
                            {a.createdAt !== a.updatedAt && (
                              <em>
                                {' • edited'} <TimeAgo datetime={new Date(a.updatedAt)} />
                              </em>
                            )}                     
                            <Typography variant="body2">[removed]</Typography>
                          </Typography>
                        ) : (
                          <div className={classes.commentWrapper}>
                            <div className={classes.commentVotesWrapper}>
                              <UpvoteButton
                                user={user}
                                body={a}
                                handleUpvote={() => handleCommentUpvote(a.id)}
                              />
                              <DownvoteButton
                                user={user}
                                body={a}
                                handleDownvote={() => handleCommentDownvote(a.id)}
                              />
                            </div>
                            <div className={classes.commentDetails}>
                              {commentDetails(a.commentedBy, a)}
                              <CommentsAndButtons
                                isMobile={isMobile}
                                comment={a}
                                postId={postId}
                                user={user}
                              />
                            </div>
                          </div>
                        )}
                        {(a.children && a.children.length !== 0) && (
                          a.children.map((b) => (
                            <div key={b.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                              {b.is_deleted ? (
                                <Typography variant="caption">
                                  <Link component={RouterLink} to={`/u/${b.username}`}>
                                    {b.username}
                                  </Link>
                                  <TimeAgo datetime={new Date(b.createdAt)} />
                                  {b.createdAt !== b.updatedAt && (
                                    <em>
                                      {' • edited'} <TimeAgo datetime={new Date(b.updatedAt)} />
                                    </em>
                                  )}                     
                                  <Typography variant="body2">[removed]</Typography>
                                </Typography>
                              ) : (
                                <div className={classes.commentWrapper}>
                                  <div className={classes.commentVotesWrapper}>
                                    <UpvoteButton
                                      user={user}
                                      body={b}
                                      handleUpvote={() => handleCommentUpvote(b.id)}
                                    />
                                    <DownvoteButton
                                      user={user}
                                      body={b}
                                      handleDownvote={() => handleCommentDownvote(b.id)}
                                    />
                                  </div>
                                  <div className={classes.commentDetails}>
                                    {commentDetails(b.commentedBy, b)}
                                    <CommentsAndButtons
                                      isMobile={isMobile}
                                      comment={b}
                                      postId={postId}
                                      user={user}
                                    />
                                  </div>
                                </div>
                              )}
                              {(b.children && b.children.length !== 0) && (
                                b.children.map((d) => (
                                  <div key={d.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                    {d.is_deleted ? (
                                      <Typography variant="caption">
                                        <Link component={RouterLink} to={`/u/${d.username}`}>
                                          {d.username}
                                        </Link>
                                        <TimeAgo datetime={new Date(d.createdAt)} />
                                        {d.createdAt !== d.updatedAt && (
                                          <em>
                                            {' • edited'} <TimeAgo datetime={new Date(d.updatedAt)} />
                                          </em>
                                        )}                     
                                        <Typography variant="body2">[removed]</Typography>
                                      </Typography>
                                    ) : (
                                      <div className={classes.commentWrapper}>
                                        <div className={classes.commentVotesWrapper}>
                                          <UpvoteButton
                                            user={user}
                                            body={d}
                                            handleUpvote={() => handleCommentUpvote(d.id)}
                                          />
                                          <DownvoteButton
                                            user={user}
                                            body={d}
                                            handleDownvote={() => handleCommentDownvote(d.id)}
                                          />
                                        </div>
                                        <div className={classes.commentDetails}>
                                          {commentDetails(d.commentedBy, d)}
                                          <CommentsAndButtons
                                            isMobile={isMobile}
                                            comment={d}
                                            postId={postId}
                                            user={user}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    {(d.children && d.children.length !== 0) && (
                                      d.children.map((e) => (
                                        <div key={e.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                          {e.is_deleted ? (
                                            <Typography variant="caption">
                                              <Link component={RouterLink} to={`/u/${e.username}`}>
                                                {e.username}
                                              </Link>
                                              <TimeAgo datetime={new Date(e.createdAt)} />
                                              {e.createdAt !== e.updatedAt && (
                                                <em>
                                                  {' • edited'} <TimeAgo datetime={new Date(e.updatedAt)} />
                                                </em>
                                              )}                     
                                              <Typography variant="body2">[removed]</Typography>
                                            </Typography>
                                          ) : (
                                            <div className={classes.commentWrapper}>
                                              <div className={classes.commentVotesWrapper}>
                                                <UpvoteButton
                                                  user={user}
                                                  body={e}
                                                  handleUpvote={() => handleCommentUpvote(e.id)}
                                                />
                                                <DownvoteButton
                                                  user={user}
                                                  body={e}
                                                  handleDownvote={() => handleCommentDownvote(e.id)}
                                                />
                                              </div>
                                              <div className={classes.commentDetails}>
                                                {commentDetails(e.commentedBy, e)}
                                                <CommentsAndButtons
                                                  isMobile={isMobile}
                                                  comment={e}
                                                  postId={postId}
                                                  user={user}
                                                />
                                              </div>
                                            </div>
                                          )}
                                          {(e.children && e.children.length !== 0) && (
                                            e.children.map((f) => (
                                              <div key={f.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                {f.is_deleted ? (
                                                  <Typography variant="caption">
                                                    <Link component={RouterLink} to={`/u/${f.username}`}>
                                                      {f.username}
                                                    </Link>
                                                    <TimeAgo datetime={new Date(f.createdAt)} />
                                                    {f.createdAt !== f.updatedAt && (
                                                      <em>
                                                        {' • edited'} <TimeAgo datetime={new Date(f.updatedAt)} />
                                                      </em>
                                                    )}                     
                                                    <Typography variant="body2">[removed]</Typography>
                                                  </Typography>
                                                ) : (
                                                  <div className={classes.commentWrapper}>
                                                    <div className={classes.commentVotesWrapper}>
                                                      <UpvoteButton
                                                        user={user}
                                                        body={f}
                                                        handleUpvote={() => handleCommentUpvote(f.id)}
                                                      />
                                                      <DownvoteButton
                                                        user={user}
                                                        body={f}
                                                        handleDownvote={() => handleCommentDownvote(f.id)}
                                                      />
                                                    </div>
                                                    <div className={classes.commentDetails}>
                                                      {commentDetails(f.commentedBy, f)}
                                                      <CommentsAndButtons
                                                        isMobile={isMobile}
                                                        comment={f}
                                                        postId={postId}
                                                        user={user}
                                                      />
                                                    </div>
                                                  </div>
                                                )}
                                                {(f.children && f.children.length !== 0) && (
                                                  f.children.map((g) => (
                                                    <div key={g.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                      {g.is_deleted ? (
                                                        <Typography variant="caption">
                                                          <Link component={RouterLink} to={`/u/${g.username}`}>
                                                            {g.username}
                                                          </Link>
                                                          <TimeAgo datetime={new Date(g.createdAt)} />
                                                          {getErrorMsg.createdAt !== g.updatedAt && (
                                                            <em>
                                                              {' • edited'} <TimeAgo datetime={new Date(g.updatedAt)} />
                                                            </em>
                                                          )}                     
                                                          <Typography variant="body2">[removed]</Typography>
                                                        </Typography>
                                                      ) : (
                                                        <div className={classes.commentWrapper}>
                                                          <div className={classes.commentVotesWrapper}>
                                                            <UpvoteButton
                                                              user={user}
                                                              body={g}
                                                              handleUpvote={() => handleCommentUpvote(g.id)}
                                                            />
                                                            <DownvoteButton
                                                              user={user}
                                                              body={g}
                                                              handleDownvote={() => handleCommentDownvote(g.id)}
                                                            />
                                                          </div>
                                                          <div className={classes.commentDetails}>
                                                            {commentDetails(g.commentedBy, g)}
                                                            <CommentsAndButtons
                                                              isMobile={isMobile}
                                                              comment={g}
                                                              postId={postId}
                                                              user={user}
                                                            />
                                                          </div>
                                                        </div>
                                                      )}
                                                      {(g.children && g.children.length !== 0) && (
                                                        g.children.map((h) => (
                                                          <div key={h.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                            {h.is_deleted ? (
                                                              <Typography variant="caption">
                                                                <Link component={RouterLink} to={`/u/${h.username}`}>
                                                                  {h.username}
                                                                </Link>
                                                                <TimeAgo datetime={new Date(h.createdAt)} />
                                                                {h.createdAt !== h.updatedAt && (
                                                                  <em>
                                                                    {' • edited'} <TimeAgo datetime={new Date(h.updatedAt)} />
                                                                  </em>
                                                                )}                     
                                                                <Typography variant="body2">[removed]</Typography>
                                                              </Typography>
                                                            ) : (
                                                              <div className={classes.commentWrapper}>
                                                                <div className={classes.commentVotesWrapper}>
                                                                  <UpvoteButton
                                                                    user={user}
                                                                    body={h}
                                                                    handleUpvote={() => handleCommentUpvote(h.id)}
                                                                  />
                                                                  <DownvoteButton
                                                                    user={user}
                                                                    body={h}
                                                                    handleDownvote={() => handleCommentDownvote(h.id)}
                                                                  />
                                                                </div>
                                                                <div className={classes.commentDetails}>
                                                                  {commentDetails(h.commentedBy, h)}
                                                                  <CommentsAndButtons
                                                                    isMobile={isMobile}
                                                                    comment={h}
                                                                    postId={postId}
                                                                    user={user}
                                                                  />
                                                                </div>
                                                              </div>
                                                            )}
                                                            {(h.children && h.children.length !== 0) && (
                                                              h.children.map((i) => (
                                                                <div key={i.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                                  {i.is_deleted ? (
                                                                    <Typography variant="caption">
                                                                      <Link component={RouterLink} to={`/u/${i.username}`}>
                                                                        {i.username}
                                                                      </Link>
                                                                      <TimeAgo datetime={new Date(i.createdAt)} />
                                                                      {i.createdAt !== i.updatedAt && (
                                                                        <em>
                                                                          {' • edited'} <TimeAgo datetime={new Date(i.updatedAt)} />
                                                                        </em>
                                                                      )}                                                                      
                                                                      <Typography variant="body2">[removed]</Typography>
                                                                    </Typography>
                                                                  ) : (
                                                                    <div className={classes.commentWrapper}>
                                                                      <div className={classes.commentVotesWrapper}>
                                                                        <UpvoteButton
                                                                          user={user}
                                                                          body={i}
                                                                          handleUpvote={() => handleCommentUpvote(i.id)}
                                                                        />
                                                                        <DownvoteButton
                                                                          user={user}
                                                                          body={i}
                                                                          handleDownvote={() => handleCommentDownvote(i.id)}
                                                                        />
                                                                      </div>
                                                                      <div className={classes.commentDetails}>
                                                                        {commentDetails(i.commentedBy, i)}
                                                                        {/* <CommentsAndButtons
                                                                          isMobile={isMobile}
                                                                          comment={i}
                                                                          postId={postId}
                                                                          user={user}
                                                                        /> */}
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                                  {/* {(i.children && i.children.length !== 0) && (
                                                                    i.children.map((j) => (
                                                                      <div key={j.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                                        {j.is_deleted ? (
                                                                          <Typography variant="caption">
                                                                            <Link component={RouterLink} to={`/u/${j.username}`}>
                                                                              {j.username}
                                                                            </Link>
                                                                            <TimeAgo datetime={new Date(j.createdAt)} />
                                                                            {j.createdAt !== j.updatedAt && (
                                                                              <em>
                                                                                {' • edited'} <TimeAgo datetime={new Date(j.updatedAt)} />
                                                                              </em>
                                                                            )}                     
                                                                            <Typography variant="body2">[removed]</Typography>
                                                                          </Typography>
                                                                        ) : (
                                                                          <div className={classes.commentWrapper}>
                                                                            <div className={classes.commentVotesWrapper}>
                                                                              <UpvoteButton
                                                                                user={user}
                                                                                body={j}
                                                                                handleUpvote={() => handleCommentUpvote(j.id)}
                                                                              />
                                                                              <DownvoteButton
                                                                                user={user}
                                                                                body={j}
                                                                                handleDownvote={() => handleCommentDownvote(j.id)}
                                                                              />
                                                                            </div>
                                                                            <div className={classes.commentDetails}>
                                                                              {commentDetails(j.commentedBy, j)}
                                                                              <CommentsAndButtons
                                                                                isMobile={isMobile}
                                                                                comment={j}
                                                                                postId={postId}
                                                                                user={user}
                                                                              />
                                                                            </div>
                                                                          </div>
                                                                        )}
                                                                        {(j.children && j.children !== 0) && (
                                                                          j.children.map((k) => (
                                                                            <div key={k.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                                              {k.is_deleted ? (
                                                                                <Typography variant="caption">
                                                                                  <Link component={RouterLink} to={`/u/${k.username}`}>
                                                                                    {k.username}
                                                                                  </Link>
                                                                                  <TimeAgo datetime={new Date(k.createdAt)} />
                                                                                  {k.createdAt !== k.updatedAt && (
                                                                                    <em>
                                                                                      {' • edited'} <TimeAgo datetime={new Date(k.updatedAt)} />
                                                                                    </em>
                                                                                  )}                     
                                                                                  <Typography variant="body2">[removed]</Typography>
                                                                                </Typography>
                                                                              ) : (
                                                                                <div className={classes.commentWrapper}>
                                                                                  <div className={classes.commentVotesWrapper}>
                                                                                    <UpvoteButton
                                                                                      user={user}
                                                                                      body={k}
                                                                                      handleUpvote={() => handleCommentUpvote(k.id)}
                                                                                    />
                                                                                    <DownvoteButton
                                                                                      user={user}
                                                                                      body={k}
                                                                                      handleDownvote={() => handleCommentDownvote(k.id)}
                                                                                    />
                                                                                  </div>
                                                                                  <div className={classes.commentDetails}>
                                                                                    {commentDetails(k.commentedBy, k)}
                                                                                    <CommentsAndButtons
                                                                                      isMobile={isMobile}
                                                                                      comment={k}
                                                                                      postId={postId}
                                                                                      user={user}
                                                                                    />
                                                                                  </div>
                                                                                </div>
                                                                              )}
                                                                              {(k.children && k.children.length !== 0) && (
                                                                                k.children.map((l) => (
                                                                                  <div key={l.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                                                    {l.is_deleted ? (
                                                                                      <Typography variant="caption">
                                                                                        <Link component={RouterLink} to={`/u/${l.username}`}>
                                                                                          {l.username}
                                                                                        </Link>
                                                                                        <TimeAgo datetime={new Date(l.createdAt)} />
                                                                                        {l.createdAt !== l.updatedAt && (
                                                                                          <em>
                                                                                            {' • edited'} <TimeAgo datetime={new Date(l.updatedAt)} />
                                                                                          </em>
                                                                                        )}                     
                                                                                        <Typography variant="body2">[removed]</Typography>
                                                                                      </Typography>
                                                                                    ) : (
                                                                                      <div className={classes.commentWrapper}>
                                                                                        <div className={classes.commentVotesWrapper}>
                                                                                          <UpvoteButton
                                                                                            user={user}
                                                                                            body={l}
                                                                                            handleUpvote={() => handleCommentUpvote(l.id)}
                                                                                          />
                                                                                          <DownvoteButton
                                                                                            user={user}
                                                                                            body={l}
                                                                                            handleDownvote={() => handleCommentDownvote(l.id)}
                                                                                          />
                                                                                        </div>
                                                                                        <div className={classes.commentDetails}>
                                                                                          {commentDetails(l.commentedBy, l)}
                                                                                          <CommentsAndButtons
                                                                                            isMobile={isMobile}
                                                                                            comment={l}
                                                                                            postId={postId}
                                                                                            user={user}
                                                                                          />
                                                                                        </div>
                                                                                      </div>
                                                                                    )}
                                                                                    {(l.children && l.children.length !== 0) && (
                                                                                      l.children.map((m) => (
                                                                                        <div key={m.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                                                          {m.is_deleted ? (
                                                                                            <Typography variant="caption">
                                                                                              <Link component={RouterLink} to={`/u/${m.username}`}>
                                                                                                {m.username}
                                                                                              </Link>
                                                                                              <TimeAgo datetime={new Date(m.createdAt)} />
                                                                                              {m.createdAt !== m.updatedAt && (
                                                                                                <em>
                                                                                                  {' • edited'} <TimeAgo datetime={new Date(m.updatedAt)} />
                                                                                                </em>
                                                                                              )}                     
                                                                                              <Typography variant="body2">[removed]</Typography>
                                                                                            </Typography>
                                                                                          ) : (
                                                                                            <div className={classes.commentWrapper}>
                                                                                              <div className={classes.commentVotesWrapper}>
                                                                                                <UpvoteButton
                                                                                                  user={user}
                                                                                                  body={m}
                                                                                                  handleUpvote={() => handleCommentUpvote(m.id)}
                                                                                                />
                                                                                                <DownvoteButton
                                                                                                  user={user}
                                                                                                  body={m}
                                                                                                  handleDownvote={() => handleCommentDownvote(m.id)}
                                                                                                />
                                                                                              </div>
                                                                                              <div className={classes.commentDetails}>
                                                                                                {commentDetails(m.commentedBy, m)}
                                                                                                <CommentsAndButtons
                                                                                                  isMobile={isMobile}
                                                                                                  comment={m}
                                                                                                  postId={postId}
                                                                                                  user={user}
                                                                                                />
                                                                                              </div>
                                                                                            </div>
                                                                                          )}
                                                                                          {(m.children && m.children.length !== 0) && (
                                                                                            m.children.map((n) => (
                                                                                              <div key={n.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                                                                {n.is_deleted ? (
                                                                                                  <Typography variant="caption">
                                                                                                    <Link component={RouterLink} to={`/u/${n.username}`}>
                                                                                                      {n.username}
                                                                                                    </Link>
                                                                                                    <TimeAgo datetime={new Date(n.createdAt)} />
                                                                                                    {n.createdAt !== n.updatedAt && (
                                                                                                      <em>
                                                                                                        {' • edited'} <TimeAgo datetime={new Date(n.updatedAt)} />
                                                                                                      </em>
                                                                                                    )}                     
                                                                                                    <Typography variant="body2">[removed]</Typography>
                                                                                                  </Typography>
                                                                                                ) : (
                                                                                                  <div className={classes.commentWrapper}>
                                                                                                    <div className={classes.commentVotesWrapper}>
                                                                                                      <UpvoteButton
                                                                                                        user={user}
                                                                                                        body={n}
                                                                                                        handleUpvote={() => handleCommentUpvote(n.id)}
                                                                                                      />
                                                                                                      <DownvoteButton
                                                                                                        user={user}
                                                                                                        body={n}
                                                                                                        handleDownvote={() => handleCommentDownvote(n.id)}
                                                                                                      />
                                                                                                    </div>
                                                                                                    <div className={classes.commentDetails}>
                                                                                                      {commentDetails(n.commentedBy, n)}
                                                                                                      <CommentsAndButtons
                                                                                                        isMobile={isMobile}
                                                                                                        comment={n}
                                                                                                        postId={postId}
                                                                                                        user={user}
                                                                                                      />
                                                                                                    </div>
                                                                                                  </div>
                                                                                                )}
                                                                                                {(n.children && n.children.length !== 0) && (
                                                                                                  n.children.map((o) => (
                                                                                                    <div key={o.id} className={classes.wholeComment} style={{marginLeft: '25px'}}>
                                                                                                      {o.is_deleted ? (
                                                                                                        <Typography variant="caption">
                                                                                                          <Link component={RouterLink} to={`/u/${o.username}`}>
                                                                                                            {o.username}
                                                                                                          </Link>
                                                                                                          <TimeAgo datetime={new Date(o.createdAt)} />
                                                                                                          {o.createdAt !== o.updatedAt && (
                                                                                                            <em>
                                                                                                              {' • edited'} <TimeAgo datetime={new Date(o.updatedAt)} />
                                                                                                            </em>
                                                                                                          )}                     
                                                                                                          <Typography variant="body2">[removed]</Typography>
                                                                                                        </Typography>
                                                                                                      ) : (
                                                                                                        <div className={classes.commentWrapper}>
                                                                                                          <div className={classes.commentVotesWrapper}>
                                                                                                            <UpvoteButton
                                                                                                              user={user}
                                                                                                              body={o}
                                                                                                              handleUpvote={() => handleCommentUpvote(o.id)}
                                                                                                            />
                                                                                                            <DownvoteButton
                                                                                                              user={user}
                                                                                                              body={o}
                                                                                                              handleDownvote={() => handleCommentDownvote(o.id)}
                                                                                                            />
                                                                                                          </div>
                                                                                                          <div className={classes.commentDetails}>
                                                                                                            {commentDetails(o.commentedBy, o)}
                                                                                                            <CommentsAndButtons
                                                                                                              isMobile={isMobile}
                                                                                                              comment={o}
                                                                                                              postId={postId}
                                                                                                              user={user}
                                                                                                            />
                                                                                                          </div>
                                                                                                        </div>
                                                                                                      )}
                                                                                                    </div>
                                                                                                  ))
                                                                                                )}
                                                                                              </div>
                                                                                            ))
                                                                                          )}
                                                                                        </div>
                                                                                      ))
                                                                                    )}
                                                                                  </div>
                                                                                ))
                                                                              )}
                                                                            </div>
                                                                          ))
                                                                        )}
                                                                      </div>
                                                                    ))
                                                                  )} */}
                                                                </div>
                                                              ))
                                                            )}
                                                          </div>
                                                        ))
                                                      )}
                                                    </div>
                                                  ))
                                                )}
                                              </div>
                                            ))
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    ))
                  )}
                </div>
              ))
            )}
          </div>
        ))
      ) : (
        <div className={classes.noCommentsBanner}>
          <ForumIcon color="primary" fontSize="large" />
          <Typography variant="h5" color="secondary">
            No Comments Yet
          </Typography>
          <Typography variant="h6" color="secondary">
            Be the first to share what you think!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default CommentsDisplay;
