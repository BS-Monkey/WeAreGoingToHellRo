import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPosts,
  loadMorePosts,
  toggleUpvote,
  toggleDownvote,
} from '../reducers/postReducer';
import { notify } from '../reducers/notificationReducer';
import { fetchDeletedPosts } from '../reducers/deletedPostReducer';
import PostCard from './PostCard';
import SortTabBar from './SortTabBar';  
import LoadMoreButton from './LoadMoreButton';
import LoadingSpinner from './LoadingSpinner';
import UpdateUserDialog from './UpdateUserDialog';
import getErrorMsg from '../utils/getErrorMsg';
import dateFormat  from 'dateformat';
import { 
  FormControl, 
  MenuItem, 
  Avatar, 
  Select, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  Typography, 
  Icon, 
  Button, 
} from '@material-ui/core';
import {
  Check as CheckIcon, 
  Close as CloseIcon, 
  Edit as EditIcon
} from '@material-ui/icons';
import EmojiNatureIcon from '@material-ui/icons/EmojiNature';
import { randomUpdatedDate } from '@material-ui/x-grid-data-generator';

import { usePostListStyles } from '../styles/muiStyles';
import {frontendUrl} from '../backendUrl';

const ManagePannel = () => {
  const [sortBy, setSortBy] = useState('User-Manage');
  const [flairBy, setFlairBy] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const setDeletedPosts = async () => {
      try {
        await dispatch(fetchDeletedPosts());
      } catch (err) {
        dispatch(notify(getErrorMsg(err), 'error'));
      }
    };

    setDeletedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  const posts = useSelector((state) => state.posts);
  const deletedPosts = useSelector((state) => state.deletedPosts);
  const users = useSelector((state) => state.users);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = usePostListStyles();

  console.log('deleted Posts', deletedPosts);

  const rows_user = [];

  if(users && users.length !== 0) {
    for(let i = 0; i < users.length; i ++) {
      rows_user.push({
        cnt: i + 1, 
        id: users[i].id, 
        avatar: users[i].avatar.imageLink, 
        username: users[i].username, 
        ip_address: users[i].ip_address, 
        login_state: users[i].is_logined, 
        ban_state: users[i].is_banned, 
        dateCreated: users[i].date_created, 
        dateUpdated: users[i].last_updated,
        lastLogin: users[i].last_login, 
        role: users[i].userRole, 
      });
    }
  }

  const handleTabChange = async (e, newValue) => {
    try {
      setPageLoading(true);
      await dispatch(fetchPosts(newValue, flairBy));
      setSortBy(newValue);
      setPageLoading(false);

      if (page !== 1) {
        setPage(1);
      }
    } catch (err) {
      setPageLoading(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleLoadPosts = async () => {
    try {
      setLoadingMore(true);
      await dispatch(loadMorePosts(sortBy, flairBy, page + 1));
      setPage((prevState) => prevState + 1);
      setLoadingMore(false);
    } catch (err) {
      setLoadingMore(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <div className={classes.root}>
      <SortTabBar
        sortBy={sortBy}
        handleTabChange={handleTabChange}
        subscribedTab={true}
        user={user}
      />
      {sortBy === 'User-Manage'
      ? rows_user && rows_user.length !== 0 && !pageLoading
        ? (
            <Paper className={classes.root}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Id</TableCell>
                      <TableCell align="center">Avatar</TableCell>
                      <TableCell align="left">username</TableCell>
                      <TableCell align="right">Ip_Address</TableCell>
                      <TableCell align="center">Loggedin</TableCell>
                      <TableCell align="center">isBanned</TableCell>
                      <TableCell align="right">Date Created</TableCell>
                      <TableCell align="right">Date Updated</TableCell>
                      <TableCell align="right">Last Login</TableCell>
                      <TableCell align="right">Role</TableCell>
                      <TableCell align="right">OPERATION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows_user.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="left">{row.cnt}</TableCell>
                        <TableCell component="th" scope="row" align="center">
                          <Avatar alt={row.username} src={row.avatar}/>
                        </TableCell>
                        <TableCell align="left">{row.username}</TableCell>
                        <TableCell align="right">{row.ip_address}</TableCell>
                        <TableCell align="center">
                          {row.login_state 
                            ? <CheckIcon style={{color: 'lightgreen'}} />
                            : <CloseIcon style={{color: 'gray'}} />
                          }
                        </TableCell>
                        <TableCell align="center">
                          {row.ban_state
                            ? <CheckIcon style={{color: 'lightgreen'}} />
                            : <CloseIcon style={{color: 'gray'}} />
                          }
                        </TableCell>
                        <TableCell align="right">{dateFormat(row.dateCreated, 'yyyy/mm/dd, hh/mm/ss')}</TableCell>
                        <TableCell align="right">{dateFormat(row.dateUpdated, 'yyyy/mm/dd, hh/mm/ss')}</TableCell>
                        <TableCell align="right">{dateFormat(row.last_login, 'yyyy/mm/dd, hh/mm/ss')}</TableCell>
                        <TableCell align="right">
                          {
                            row.role === 1
                            ? 'Admin'
                            : row.role === 2 
                              ? 'Moderator'
                              : 'Client'
                          }
                        </TableCell>
                        <TableCell align="right">
                          {
                            row.role > user.userrole 
                            ? <UpdateUserDialog modalData={row} />
                            : null
                          }
                          
                        </TableCell>                          
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
        ) : (
          <LoadingSpinner text={'Fetching posts. Wait a sec.'} />
        )
      : sortBy === 'Post-Manage'
        ? deletedPosts && !pageLoading
          ? (
              deletedPosts.map((post) => (
                <PostCard
                  post={post}
                  key={post.id}
                  toggleUpvote={toggleUpvote}
                  toggleDownvote={toggleDownvote}
                />
              ))
          ) : (
            <LoadingSpinner text={'Fetching posts. Wait a sec.'} />
          )
        : (
          null
        )
      }
      {posts && 'next' in posts && !pageLoading && (
        <LoadMoreButton
          handleLoadPosts={handleLoadPosts}
          loading={loadingMore}
        />
      )}
    </div>
  );
};

export default ManagePannel;
