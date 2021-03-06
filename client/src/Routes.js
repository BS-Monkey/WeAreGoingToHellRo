import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import PostFormModal from './components/PostFormModal';
import PostList from './components/PostList';
import PostCommentsPage from './components/PostCommentsPage';
import UserPage from './components/UserPage';
import SubPage from './components/SubPage';
import UsersPanel from './components/UsersPanel';
import SearchResults from './components/SearchResults';
import NotFoundPage from './components/NotFoundPage';
import ManagePannel from './admin/ManagePannel';

import { Container } from '@material-ui/core/';
import { useMainPaperStyles } from './styles/muiStyles';

const Routes = () => {
  const classes = useMainPaperStyles();

  return (
    <Switch>
      <Route exact path="/">
        <Container disableGutters className={classes.homepage}>
          <div className={classes.postsPanel}>
            <PostFormModal />
            <PostList />
          </div>
          <UsersPanel />
        </Container>
      </Route>
      <Route exact path="/comments/:id">    
        <PostCommentsPage />
      </Route>
      <Route exact path="/u/:username">
        <UserPage />
      </Route>
      <Route exact path="/r/:sub">
        <SubPage />
      </Route>
      <Route exact path="/search/:query">
        <SearchResults />
      </Route>
      <Route exact path="/manage">
        <Container disableGutters className={classes.homepage}>
          <div className={classes.postsPanel}>
            <PostFormModal />
            <ManagePannel />
          </div>
          <UsersPanel />
        </Container>
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default Routes;
