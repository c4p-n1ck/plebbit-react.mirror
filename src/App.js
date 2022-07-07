import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ProfileDataProvider } from './store/profileContext';
import Layout from './components/layout';
import Home from './views/Home';
import PostCreate from './components/Post/CreatePost';
import Profile from './views/Profile';
import PostDetails from './components/Post/PostDetails';
import SubPlebbit from './views/SubPlebbit';
import Settings from './views/Settings';
import About from './views/About';

const App = () => {
  return (
    <Router>
      <Switch>
        <ProfileDataProvider>
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/p/:subplebbitAddress/submit" component={PostCreate} />
            <Route exact path="/submit" component={PostCreate} />
            <Route exact path="/settings" component={Settings} name="settings" />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/p/:subplebbitAddress" component={SubPlebbit} />
            <Route exact path="/p/:subplebbitAddress/c/:commentCid" component={PostDetails} />
            <Route exact path="/p/:subplebbitAddress/about" component={About} />
          </Layout>
        </ProfileDataProvider>
      </Switch>
    </Router>
  );
};

export default App;
