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
  sce: createMuiTheme(configThemes.sce),
};

const mapRouteToThemes = {
  '/': 'default',
  '/sce': 'sce',
}

class ThemeProvider extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { pathname } = props.location;
    const theme = themes[mapRouteToThemes[pathname]];

    if (theme && (state.theme !== theme)) {
      return { theme };
    }

    return null;
  }

  state = { theme: themes.default };

  changeTheme = theme => themes[theme] &&
    this.setState({ theme: themes[mapRouteToThemes[theme]] });

  render() {
    return(
      <MuiThemeProvider theme={this.state.theme}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export { withTheme };

export default withRouter(ThemeProvider);
