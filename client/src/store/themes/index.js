import React, { PureComponent } from 'react';

import {
  createMuiTheme,
  withTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';

import { themes as configThemes } from 'config';

const themes = {
  default: createMuiTheme(configThemes.default),
  fileManager: createMuiTheme(configThemes.fileManager),
};

const mapRouteToThemes = {
  '/': 'default',
  '/file-manager': 'fileManager',
}

class ThemeProvider extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { pathname } = props.location;
    const theme = themes[mapRouteToThemes[pathname]];

    if (theme && state.theme !== theme) {
      return { theme };
    }

    return null;
  }

  state = { theme: themes.default };

  changeTheme = theme => themes[theme] &&
    this.setState({ theme: themes[theme] });

  render() {
    const {
      state,
      changeTheme,
    } = this;

    return(
      <MuiThemeProvider theme={{ ...state.theme, changeTheme }}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export { withTheme };

export default withRouter(ThemeProvider);
