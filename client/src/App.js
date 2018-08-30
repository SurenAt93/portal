import React from 'react';

import { Header, Content } from 'sections';

import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from 'store/themes';

import './App.scss';

const App = _ => (
  <BrowserRouter>
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
