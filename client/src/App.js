import React, { Component } from 'react';

import { Header } from 'sections';

import ThemeProvider from 'store/themes';

import './App.scss';

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <div>
          <Header />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
