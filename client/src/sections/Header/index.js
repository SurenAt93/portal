import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Third-Party Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Decorators
import { withTheme } from 'store/themes';

// Styles
import './index.scss';

class TopBar extends PureComponent {
  render() {
    return (
      <div className="header">
        <AppBar position="static">
          <Toolbar>
            <img
              src="icons/web_hi_res_512.png"
              alt="portal_icon"
              width="40"
              className="header__logo"
            />
            <Typography
              variant="title"
              color="inherit"
              className="header__title"
            >
              Portal
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopBar.propTypes = {
  theme: PropTypes.object.isRequired,
};

const DecoratedTopBar = withTheme()(TopBar);

DecoratedTopBar.propTypes = {
  // This component doesn't expect any props from outside (until nowadays)
};

export default DecoratedTopBar;
