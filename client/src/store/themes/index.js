import React, { PureComponent } from 'react';

import {
  createMuiTheme,
  withTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

import { themes as configThemes } from 'config';

const themes = {
  default: createMuiTheme(configThemes.default),
  editor: createMuiTheme(configThemes.editor),
};

class ThemeProvider extends PureComponent {
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

export default ThemeProvider;
