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

  editor: {
    palette: {
      primary: {
        main: '#202124',
      },
      text: {
        primary: '#fff',
      }
    },
  },
}

const helperTexts = { };

const messages = { };

export {
  helperTexts,
  messages,
  themes,
};
