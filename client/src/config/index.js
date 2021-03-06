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

  sce: {
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

  monaco: {
    'night-dark': {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#202124',
      },
    },
  },
};

const urls = {
  monaco_loader: '/monaco-editor/vs/loader.js',
  monaco_base: '/monaco-editor/vs',
}

const helperTexts = { };

const messages = { };

// NOTE ::: It's just for demo
const normalizeDataStructure = obj =>
  obj.children &&
  obj.children.sort((a, b) => +!a.children - +!b.children) &&
  obj.children.forEach(normalizeDataStructure);

const sampleFileStructure = {
  name: '/',
  open: false,
  children: [
    {
      name: 'home',
      open: false,
      children: [
        { name: 'sample.xml' },
        {
          name: 'project_1',
          open: false,
          children: [
            { name: 'app.js' },
            { name: 'config.js' },
            { name: 'util.js' },
          ],
        },
        {
          name: 'project_2',
          open: false,
          children: [
            { name: 'index.html' },
            { name: 'script.js' },
            { name: 'style.css' },
          ],
        },
      ]
    },
    {
      name: 'empty_folder',
      open: false,
      children: [],
    },
    { name: 'rm.py' },
    {
      name: 'opt',
      open: false,
      children: [
          {
            name: 'libs',
            open: false,
            children: [
              { name: 'ssd.rs' },
              { name: 'so.c' },
              { name: 'log.py' },
              { name: 'hud.cpp' },
              { name: 'odd.swift' },
              { name: 'pwe.yaml' },
              { name: 'og.rb' },
              { name: 'server.ts' },
              { name: 'config.json' },
              { name: 'init.go' },
              { name: 'sc.lua' },
              { name: '.git', open: false, children: [ { name: 'config.yaml' } ] },
              { name: 'query.sql' },
              { name: 'tb.xml' },
            ],
          },
      ],
    },
  ],
};

normalizeDataStructure(sampleFileStructure);

const mapExtToLang = {
  'js': 'javascript',
  'html': 'html',
  'css': 'css',
  'rs': 'rust',
  'c': 'c',
  'cpp': 'cpp',
  'py': 'python',
  'swift': 'swift',
  'yaml': 'yaml',
  'rb': 'ruby',
  'ts': 'typescript',
  'json': 'json',
  'go': 'go',
  'lua': 'lua',
  'sql': 'sql',
  'xml': 'xml',
};

export {
  helperTexts,
  messages,
  themes,
  urls,
  sampleFileStructure,
  mapExtToLang,
};
