import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import PostFormModal from '../components/PostFormModal';
import PostList from '../components/PostList';
import PostCommentsPage from '../components/PostCommentsPage';
import UserPage from '../components/UserPage';
import SubPage from '../components/SubPage';
import UsersPanel from '../components/UsersPanel';
import SearchResults from '../components/SearchResults';
import NotFoundPage from '../components/NotFoundPage';
import ManagePannel from '../admin/ManagePannel';
import ManagePostCommentsPage from '../admin/PostCommentsPage';

import { Container, Grid } from '@material-ui/core/';
import { useMainPaperStyles } from '../styles/muiStyles';
import {AdminRoute} from './middleware'

const Routes = () => {
  const classes = useMainPaperStyles();
  const {user} = useSelector((state) => state);

  return (
    <Switch>
      <Route exact path="/">
        <Container disableGutters className={classes.homepage}>
          <Grid container>
            <Grid item md={9} xs={12}>
              <div className={classes.postsPanel}>
                <PostFormModal />
                <PostList />
              </div>
            </Grid>
            <Grid item md={3} xs={12}>
              <UsersPanel />
            </Grid>
          </Grid>
        </Container>
      </Route>
      <Route exact path="/comments/:id">    
        <PostCommentsPage />
      </Route>
      <Route exact path="/manage/comments/:id">    
        <ManagePostCommentsPage />
      </Route>
      <Route exact path="/u/:username">
        <UserPage />
      </Route>
      <Route exact path="/search/:query">
        <SearchResults />
      </Route>
      <AdminRoute exact path="/manage">
        <Container disableGutters className={classes.homepage}>
          <Grid container>
            <Grid item md={9} xs={12}>
              <div className={classes.postsPanel}>
                <PostFormModal />
                <ManagePannel />
              </div>
            </Grid>
            <Grid item md={3} xs={12}>
              <UsersPanel />
            </Grid>
          </Grid>
        </Container>
      </AdminRoute>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default Routes;
