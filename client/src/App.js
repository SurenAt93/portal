import React from 'react';

import { Header, Content } from 'sections';

import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from 'store/themes';
import { JssProvider } from '_jss';

const App = _ => (
  <JssProvider>
    <BrowserRouter>
      <ThemeProvider>
        <Header />
        <Content />
      </ThemeProvider>
    </BrowserRouter>
  </JssProvider>
);

export default App;
