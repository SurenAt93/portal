import React from 'react';

// Third-Party Components
import Paper from '@material-ui/core/Paper';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import { Monitoring, SCE } from 'pages';
import NoMatch from 'components/NoMatch';

import './index.scss';

const Content = props => (
  <div className="main__wrapper">
    <Paper className="main__wrapper--paper" elevation={0}>
      <Switch>
        <Route exact path="/" component={Monitoring} />
        <Route exact path="/file-manager" component={SCE} />
        <Route exact path="/404" component={NoMatch} />
        <Redirect to="/404" />
      </Switch>
    </Paper>
  </div>
);

Content.propTypes = {
  // This component doesn't expect any props from outside (until nowadays)
};

export default Content;
