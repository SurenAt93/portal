import React, { Component } from 'react';

import { Header, Content } from 'sections';

import ThemeProvider from 'store/themes';

import './App.scss';

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <div>
          <Header />
          <Content />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
