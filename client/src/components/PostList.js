import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPosts,
  loadMorePosts,
  toggleUpvote,
  toggleDownvote,
} from '../reducers/postReducer';
import { notify } from '../reducers/notificationReducer';
import PostCard from './PostCard';
import SortTabBar from './SortTabBar';
import LoadMoreButton from './LoadMoreButton';
import LoadingSpinner from './LoadingSpinner';
import getErrorMsg from '../utils/getErrorMsg';

import { Typography } from '@material-ui/core';
import { usePostListStyles } from '../styles/muiStyles';

const PostList = () => {
  const [sortBy, setSortBy] = useState('hot');
  const [flairBy, setFlairBy] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const posts = useSelector((state) => state.posts);
  const pinPosts = useSelector((state) => state.pinPosts);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = usePostListStyles();

  console.log('pin_posts', pinPosts);
  console.log('normal_posts', posts);

  const handleTabChange = async (e, newValue) => {
    try {
      setPageLoading(true);
      console.log(newValue);
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

  const handleSelectChange = async (event) => {
    try {
      setPageLoading(true);
      setFlairBy(event.target.value);
      await dispatch(fetchPosts(sortBy, event.target.value));
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
        filterFlair={flairBy}
        handleTabChange={handleTabChange}
        handleSelectChange={handleSelectChange}
        subscribedTab={true}
        user={user}
      />
      {pinPosts && pinPosts.length !== 0 && (
        pinPosts.map((post) => (
          <PostCard
            post={post}
            key={post.id}
            toggleUpvote={toggleUpvote}
            toggleDownvote={toggleDownvote}
          />
        ))
      )}
      {posts && posts.results && !pageLoading 
      ? 
        (
          posts.results.map((post) => (
            <PostCard
              post={post}
              key={post.id}
              toggleUpvote={toggleUpvote}
              toggleDownvote={toggleDownvote}
            />
          ))
        ) 
      : 
        (
          <LoadingSpinner text={'Fetching posts. Wait a sec.'} />
        )
      }
      {sortBy === 'subscribed' && posts.results.length === 0 && (
        <div className={classes.noSubscribedPosts}>
          <Typography variant="h5" color="secondary">
            No Posts Found
          </Typography>
          <Typography variant="h6" color="secondary">
            Subscribe to more subs if you haven't!
          </Typography>
        </div>
      )}
      {user && user.username !== '' && posts && 'next' in posts && !pageLoading && (
        <LoadMoreButton
          handleLoadPosts={handleLoadPosts}
          loading={loadingMore}
        />
      )}
    </div>
  );
};

export default PostList;
