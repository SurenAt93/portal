import indigo from '@material-ui/core/colors/indigo';

const themes = {
  default: {
    palette: {
      primary: {
        ...indigo,
        main: '#f5f5f5'
      },
    },
  },

  fileManager: {
    palette: {
      primary: {
        main: '#202124',
      },
      text: {
        primary: '#fff',
      },
      type: 'dark',
    },
  },
}

const urls = {
  monaco_loader: '/monaco-editor/vs/loader.js',
  monaco_base: '/monaco-editor/vs',
}

const helperTexts = { };

const messages = { };

export {
  helperTexts,
  messages,
  themes,
  urls,
};
