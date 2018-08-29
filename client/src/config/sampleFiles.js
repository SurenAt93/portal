/* eslint no-useless-escape: 0 */

const sampleFiles = {
  'app.js': `import { __getDirname, connectMessage } from './utils/';
const __dirname = __getDirname(import.meta.url);

// Native packages
import http from 'http';
import path from 'path';

// Third-party packages
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Config
import globalConfig from './config';

// Middlewares
import errorHandler from './errorHandler';

const [, entryFile] = process.argv;
const rootPath = path.dirname(entryFile);

const __main__ = rootPath === __dirname;

const clientPath = __main__
  ? path.join(__dirname, '../client')
  : path.join(rootPath, './client');

const server = {
  async start(config) {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(errorHandler);

    app.use(express.static(path.join(clientPath, 'build')));

    app.get('*', (req, res) => res.sendFile(path.join(clientPath, 'build/index.html')));

    const server = http.createServer(app);

    const port = (config && config.port) || globalConfig.get('port');

    server.listen(port, connectMessage({ port }));
  }
};

if(__main__) {
  server.start();
}

export default server;
`,
'config.js': `import indigo from '@material-ui/core/colors/indigo';

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

const sampleFileStructure = {
  name: '/',
  children: [
    {
      name: 'home',
      children: [
        {
          name: 'project_1',
          children: [
            { name: 'app.js' },
            { name: 'config.js' },
            { name: 'util.js' },
          ],
        },
        {
          name: 'project_2',
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
      loading: true,
      children: []
    },
    {
      name: 'opt',
      children: [
          {
            name: 'libs',
            children: [
              { name: 'ssd.rs' },
              { name: 'so.c' },
              { name: 'log.py' },
              { name: 'hud.cpp' },
              { name: 'odd.swift' },
              { name: 'pwe.yaml' },
              { name: 'og.ruby' },
              { name: 'server.ts' },
              { name: 'config.json' },
              { name: 'init.go' },
              { name: 'sc.lua' },
              { name: 'query.sql' },
              { name: 'tb.xml' },
              { name: 's.schema' },
            ],
          },
      ],
    },
  ],
};

const mapExtToLang = {
  'js': 'javascript',
};

export {
  helperTexts,
  messages,
  themes,
  urls,
  sampleFileStructure,
  mapExtToLang,
};
`,
'util.js': `/* eslint-disable no-sequences */
import React from 'react';

import { existingRoutes } from 'config';
import Fetch from 'utils/fetch';

const getRouteTitle = location => {
  return location === '/' ? existingRoutes.default : location.split('/')[1].toUpperCase();
}

const checkHTML = html => {
  const doc = document.createElement('div');

  // Prepare html
  // During convertations html by injecting it to DOM element
  // Image tags like this
  // <img src="..." alt="..." style="..."/>
  // Becomes - <img src="..." alt="..." style="..."> ( The last slash symbol removed )
  // And it conflicts with generated html by 'draftjs-to-html' library
  // So, for avoiding such kind of conflicts we have to remove last slash symbols
  // from image tags before comparing.
  const images = html.match(/<img.* />/g);

  const preparedHtml = images.reduce(
    (acc, img) => (acc = acc.replace(img, img.replace('/>', '>'), acc)),
    html
  );

  doc.innerHTML = preparedHtml;
  return doc.innerHTML === preparedHtml;
};

const omit = (obj, exclude) =>
  Object.keys(obj).reduce((acc, item) =>
    (!exclude.includes(item) && (acc[item] = obj[item]), acc), {});

const pick = (obj, picks) =>
  Object.keys(obj).reduce((acc, item) =>
    (picks.includes(item) && (acc[item] = obj[item]), acc), {});

async function makeRequest(url, method, data) {
  try {
    const response = await Fetch.request(url, method, data);

    return response && (response.success
      ? response
      : pick(response, ['errorMessage', 'status']));
  } catch(err) {
    console.warn(err);
    return { errorMessage: err };
  }
}

const removeItem = (arr, i) => {
  const res = arr.slice(0);
  res.splice(i, 1);
  return res;
}

const getTeamScore = (results, team) => (results[team._id] && results[team._id].score) || 0;

const getResultsWithNames = (results, teams) => Object.keys(results).reduce(
  (acc, key) => (acc.push(
    key === 'guests'
      ? {
        name: 'Guests',
        _id: 1,
        ...results.guests,
      }
      : { ...teams.find(team => team._id === key), ...results[key] }
  ), acc),
  [],
);

const withNewLinens = (str = '', initial = '') => [].split('').map((item, i) => <div key={i}>{item}</div>);

const collectionToObject = (array, idKey = 'id') => array.reduce((acc, item) => (acc[item[idKey]] = item, acc), {});

const convertToQuery = params => Object.entries(params).map(param => param.join('=')).join('&');

const removeMilliseconds = dateString => dateString.split('.')[0];

const sort = (arr, key) => {
  // This function should be extend in the future
  return arr.sort((a, b) => {
    if (key === 'date' && typeof a[key] === 'string') {
      return (new Date(a[key])).valueOf() - (new Date(b[key])).valueOf();
    }

    return a[key] - b[key];
  });
};

export {
  getRouteTitle,
  omit,
  makeRequest,
  removeItem,
  getTeamScore,
  getResultsWithNames,
  withNewLinens,
  checkHTML,
  collectionToObject,
  convertToQuery,
  removeMilliseconds,
  sort,
};
`,
'index.html': `

<!DOCTYPE html>
<html lang="en-US">
<head>
<title>HTML File Paths</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="Keywords" content="HTML,CSS,JavaScript,SQL,PHP,jQuery,XML,DOM,Bootstrap,Python,Web development,W3C,tutorials,programming,training,learning,quiz,primer,lessons,references,examples,source code,colors,demos,tips">
<meta name="Description" content="Well organized and easy to understand Web building tutorials with lots of examples of how to use HTML, CSS, JavaScript, SQL, PHP, and XML.">
<link rel="icon" href="/favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="/w3css/4/w3.css">

<script async="async" type="text/javascript" src="//static.h-bid.com/w3schools.com/20180525/snhb-w3schools.min.js"></script>
<script type='text/javascript'>
(function() {
var gads = document.createElement('script');
gads.async = true;
gads.type = 'text/javascript';
gads.src = 'https://www.googletagservices.com/tag/js/gpt.js';
var node = document.getElementsByTagName('script')[0];
node.parentNode.insertBefore(gads, node);
})();
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
var snhb = snhb || {}; snhb.queue = snhb.queue || [];
snhb.options = {
               logOutputEnabled : false,
               autoStartAuction: false,
               gdpr: {
                     mainGeo: "us",
                     reconsiderationAppealIntervalSeconds: 0
                     }
               };
               
// GPT slots
var gptAdSlots = [];
googletag.cmd.push(function() {
googletag.pubads().disableInitialLoad();               
googletag.pubads().enableSingleRequest();
var leaderMapping = googletag.sizeMapping().
// Mobile ad
addSize([0, 0], [320, 50]). 
// Vertical Tablet ad
addSize([480, 0], [468, 60]). 
// Horizontal Tablet
addSize([780, 0], [728, 90]).
// Small Desktop
addSize([993, 0], [468, 60]).
// Normal Desktop
addSize([1150, 0], [728, 90]).
// Large Desktop and bigger ad
addSize([1425, 0], [[728, 90], [970, 90]]).build();
gptAdSlots[0] = googletag.defineSlot('/16833175/MainLeaderboard', [[728, 90], [970, 90]], 'div-gpt-ad-1422003450156-2').
defineSizeMapping(leaderMapping).addService(googletag.pubads());
var skyMapping = googletag.sizeMapping().
// Mobile ad
addSize([0, 0], [320, 50]). 
// Tablet ad
addSize([975, 0], [120, 600]). 
// Desktop
addSize([1135, 0], [160, 600]).   
// Large Desktop
addSize([1675, 0], [[160, 600], [300, 600], [300, 1050]]).build();
gptAdSlots[1] = googletag.defineSlot('/16833175/WideSkyScraper', [[160, 600], [300, 600], [300, 1050]], 'div-gpt-ad-1422003450156-5').
defineSizeMapping(skyMapping).addService(googletag.pubads());
var stickyMapping = googletag.sizeMapping().
// Mobile ad
addSize([0, 0], []). 
// Tablet ad
addSize([975, 0], [120, 600]). 
// Desktop
addSize([1135, 0], [160, 600]).   
// Large Desktop
addSize([1675, 0], [[160, 600], [300, 600], [300, 250]]).build();
gptAdSlots[4] = googletag.defineSlot('/16833175/StickySkyScraper', [[300, 600], [120, 600], [300, 250], [160, 600]], 'div-gpt-ad-1472547360578-0').
defineSizeMapping(stickyMapping).addService(googletag.pubads());
var mcontMapping = googletag.sizeMapping().
// Mobile ad
addSize([0, 0], [[300, 250], [336, 280], [320, 50]]). 
// Vertical Tablet ad
addSize([490, 0], [[300, 250], [336, 280], [468, 60]]). 
// Horizontal Tablet
addSize([750, 0], [728, 90]).
// Small Desktop
addSize([993, 0], [[300, 250], [336, 280], [468, 60]]).
// Normal Desktop
addSize([1135, 0], [728, 90]).
// Large Desktop and bigger ad
addSize([1440, 0], [[728, 90], [970, 90], [970, 250]]).build();
gptAdSlots[5] = googletag.defineSlot('/16833175/MidContent', [[300, 250], [336, 280]], 'div-gpt-ad-1493883843099-0').
defineSizeMapping(mcontMapping).setCollapseEmptyDiv(true).addService(googletag.pubads());
var bmrMapping = googletag.sizeMapping().
// Smaller
addSize([0, 0], [[300, 250], [336, 280]]). 
// Large Desktop
addSize([1240, 0], [[300, 250], [336, 280], [970, 250]]).build();
gptAdSlots[2] = googletag.defineSlot('/16833175/BottomMediumRectangle', [[300, 250], [336, 280], [970, 250]], 'div-gpt-ad-1422003450156-0').
defineSizeMapping(bmrMapping).setCollapseEmptyDiv(true).addService(googletag.pubads());
var rbmrMapping = googletag.sizeMapping().
// Smaller
addSize([0, 0], []). 
// Large Desktop
addSize([975, 0], [[300, 250], [336, 280]]).build();
gptAdSlots[3] = googletag.defineSlot('/16833175/RightBottomMediumRectangle', [[300, 250], [336, 280]], 'div-gpt-ad-1422003450156-3').
defineSizeMapping(rbmrMapping).setCollapseEmptyDiv(true).addService(googletag.pubads());
googletag.pubads().setTargeting("content",(function () {
  var folder = location.pathname;
  folder = folder.replace("/", "");
  folder = folder.substr(0, folder.indexOf("/"));
  return folder;
})()
);
snhb.queue.push(function(){

snhb.startAuction(["main_leaderboard", "wide_skyscraper", "bottom_medium_rectangle", "right_bottom_medium_rectangle"]);

});
googletag.enableServices();
});
</script>
<script src="//static.h-bid.com/gdpr/cmp.stub.js" type="text/javascript"></script>
<script type='text/javascript'>
var stickyadstatus = "";
function fix_stickyad() {
  document.getElementById("stickypos").style.position = "sticky";
  var elem = document.getElementById("stickyadcontainer");
  if (!elem) {return false;}
  if (document.getElementById("skyscraper")) {
    var skyWidth = Number(w3_getStyleValue(document.getElementById("skyscraper"), "width").replace("px", ""));  
    }
  else {
    var skyWidth = Number(w3_getStyleValue(document.getElementById("right"), "width").replace("px", ""));  
  }
  elem.style.width = skyWidth + "px";
  if (window.innerWidth <= 992) {
    elem.style.position = "";
    elem.style.top = stickypos + "px";
    return false;
  }
  var stickypos = document.getElementById("stickypos").offsetTop;
  var docTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  var adHeight = Number(w3_getStyleValue(elem, "height").replace("px", ""));
  if (stickyadstatus == "") {
    if ((stickypos - docTop) < 60) {
      elem.style.position = "fixed";
      elem.style.top = "60px";
      stickyadstatus = "sticky";
      document.getElementById("stickypos").style.position = "sticky";

    }
  } else {
    if ((docTop + 60) - stickypos < 0) {  
      elem.style.position = "";
      elem.style.top = stickypos + "px";
      stickyadstatus = "";
      document.getElementById("stickypos").style.position = "static";
    }
  }
  if (stickyadstatus == "sticky") {
    if ((docTop + adHeight + 60) > document.getElementById("footer").offsetTop) {
      elem.style.position = "absolute";
      elem.style.top = (document.getElementById("footer").offsetTop - adHeight) + "px";
      document.getElementById("stickypos").style.position = "static";
    } else {
        elem.style.position = "fixed";
        elem.style.top = "60px";
        stickyadstatus = "sticky";
        document.getElementById("stickypos").style.position = "sticky";
    }
  }
}
function w3_getStyleValue(elmnt,style) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(elmnt,null).getPropertyValue(style);
  } else {
    return elmnt.currentStyle[style];
  }
}
</script>
</head>
<body>
<div class='w3-container top'>
  <a class='w3schools-logo' href='//www.w3schools.com'>w3schools<span class='dotcom'>.com</span></a>
  <div class='w3-right w3-hide-small w3-wide toptext' style="font-family:'Segoe UI',Arial,sans-serif">THE WORLD'S LARGEST WEB DEVELOPER SITE</div>
</div>

<div style='display:none;position:absolute;z-index:4;right:52px;height:44px;background-color:#5f5f5f;letter-spacing:normal;' id='googleSearch'>
  <div class='gcse-search'></div>
</div>
<div style='display:none;position:absolute;z-index:3;right:111px;height:44px;background-color:#5f5f5f;text-align:right;padding-top:9px;' id='google_translate_element'></div>

<div class='w3-card-2 topnav' id='topnav'>
  <div style="overflow:auto;">
    <div class="w3-bar w3-left" style="width:100%;overflow:hidden;height:44px">
      <a href='javascript:void(0);' class='topnav-icons fa fa-menu w3-hide-large w3-left w3-bar-item w3-button' onclick='open_menu()' title='Menu'></a>
      <a href='/default.asp' class='topnav-icons fa fa-home w3-left w3-bar-item w3-button' title='Home'></a>
      <a class="w3-bar-item w3-button" href='/html/default.asp' title='HTML Tutorial'>HTML</a>
      <a class="w3-bar-item w3-button" href='/css/default.asp' title='CSS Tutorial'>CSS</a>
      <a class="w3-bar-item w3-button" href='/js/default.asp' title='JavaScript Tutorial'>JAVASCRIPT</a>
      <a class="w3-bar-item w3-button" href='/sql/default.asp' title='SQL Tutorial'>SQL</a>
      <a class="w3-bar-item w3-button" href='/php/default.asp' title='PHP Tutorial'>PHP</a>
      <a class="w3-bar-item w3-button" href='/bootstrap/default.asp' title='Bootstrap Tutorial'>BOOTSTRAP</a>
      <a class="w3-bar-item w3-button" href='/howto/default.asp' title='How To'>HOW TO</a>
      <a class="w3-bar-item w3-button" href='/jquery/default.asp' title='jQuery Tutorial'>JQUERY</a>
      <a class="w3-bar-item w3-button" href='/w3css/default.asp' title='W3.CSS Tutorial'>W3.CSS</a>
      <a class="w3-bar-item w3-button" href='/python/default.asp' title='Python Tutorial'>PYTHON</a>
      <a class="w3-bar-item w3-button" href='/xml/default.asp' title='XML Tutorial'>XML</a>
      <a class="w3-bar-item w3-button" id='topnavbtn_tutorials' href='javascript:void(0);' onclick='w3_open_nav("tutorials")' title='Tutorials'>MORE <i class='fa fa-caret-down'></i><i class='fa fa-caret-up' style='display:none'></i></a>
      <a href='javascript:void(0);' class='topnav-icons fa w3-right w3-bar-item w3-button' onclick='open_search(this)' title='Search W3Schools'>&#xe802;</a>
      <a href='javascript:void(0);' class='topnav-icons fa w3-right w3-bar-item w3-button' onclick='open_translate(this)' title='Translate W3Schools'>&#xe801;</a>
      <a class="w3-bar-item w3-button w3-right" href='/forum/default.asp'>FORUM</a>
      <a class="w3-bar-item w3-button w3-right" id='topnavbtn_examples' href='javascript:void(0);' onclick='w3_open_nav("examples")' title='Examples'>EXAMPLES <i class='fa fa-caret-down'></i><i class='fa fa-caret-up' style='display:none'></i></a>
      <a class="w3-bar-item w3-button w3-right" id='topnavbtn_references' href='javascript:void(0);' onclick='w3_open_nav("references")' title='References'>REFERENCES <i class='fa fa-caret-down'></i><i class='fa fa-caret-up' style='display:none'></i></a>
    </div>
    <div id='nav_tutorials' class='w3-bar-block w3-card-2' style="display:none;">
      <span onclick='w3_close_nav("tutorials")' class='w3-button w3-xlarge w3-right' style="position:absolute;right:0;font-weight:bold;">&times;</span>
      <div class='w3-row-padding' style="padding:24px 48px">
        <div class='w3-col l3 m4'>
          <h3>HTML and CSS</h3>
          <a class="w3-bar-item w3-button" href='/html/default.asp'>Learn HTML</a>
          <a class="w3-bar-item w3-button" href='/css/default.asp'>Learn CSS</a>
          <a class="w3-bar-item w3-button" href='/w3css/default.asp'>Learn W3.CSS</a>
          <a class="w3-bar-item w3-button" href='/colors/default.asp'>Learn Colors</a>
          <a class="w3-bar-item w3-button" href='/bootstrap/default.asp'>Learn Bootstrap 3</a>
          <a class="w3-bar-item w3-button" href='/bootstrap4/default.asp'>Learn Bootstrap 4</a>
          <a class="w3-bar-item w3-button" href='/graphics/default.asp'>Learn Graphics</a>
          <a class="w3-bar-item w3-button" href='/icons/default.asp'>Learn Icons</a>
          <a class="w3-bar-item w3-button" href='/howto/default.asp'>Learn How To</a>
        </div>
        <div class='w3-col l3 m4'>  
          <h3>JavaScript</h3>
          <a class="w3-bar-item w3-button" href='/js/default.asp'>Learn JavaScript</a>
          <a class="w3-bar-item w3-button" href='/jquery/default.asp'>Learn jQuery</a>
          <a class="w3-bar-item w3-button" href='/angular/default.asp'>Learn AngularJS</a>
          <a class="w3-bar-item w3-button" href="/js/js_json_intro.asp">Learn JSON</a>
          <a class="w3-bar-item w3-button" href='/js/js_ajax_intro.asp'>Learn AJAX</a>
          <a class="w3-bar-item w3-button" href="/w3js/default.asp">Learn W3.JS</a>
          <div class="w3-hide-small"><br><br></div>
        </div>
        <div class='w3-col l3 m4'>
          <h3>Server Side</h3>
          <a class="w3-bar-item w3-button" href='/sql/default.asp'>Learn SQL</a>
          <a class="w3-bar-item w3-button" href='/php/default.asp'>Learn PHP</a>
          <a class="w3-bar-item w3-button" href='/python/default.asp'>Learn Python</a>
          <a class="w3-bar-item w3-button" href='/asp/default.asp'>Learn ASP</a>
          <a class="w3-bar-item w3-button" href='/nodejs/default.asp'>Learn Node.js</a>
          <a class="w3-bar-item w3-button" href='/nodejs/nodejs_raspberrypi.asp'>Learn Raspberry Pi</a>          
          <h3>Web Building</h3>
          <a class="w3-bar-item w3-button" href="/w3css/w3css_templates.asp">Web Templates</a>
          <a class="w3-bar-item w3-button" href='/browsers/default.asp'>Web Statistics</a>
          <a class="w3-bar-item w3-button" href='/cert/default.asp'>Web Certificates</a>
          <a class="w3-bar-item w3-button" href='/tryit/default.asp'>Web Editor</a>
        </div>
        <div class='w3-col l3 m4'>
          <h3>XML</h3>
          <a class="w3-bar-item w3-button" href='/xml/default.asp'>Learn XML</a>
          <a class="w3-bar-item w3-button" href='/xml/ajax_intro.asp'>Learn XML AJAX</a>
          <a class="w3-bar-item w3-button" href="/xml/dom_intro.asp">Learn XML DOM</a>
          <a class="w3-bar-item w3-button" href='/xml/xml_dtd_intro.asp'>Learn XML DTD</a>
          <a class="w3-bar-item w3-button" href='/xml/schema_intro.asp'>Learn XML Schema</a>
          <a class="w3-bar-item w3-button" href='/xml/xsl_intro.asp'>Learn XSLT</a>
          <a class="w3-bar-item w3-button" href='/xml/xpath_intro.asp'>Learn XPath</a>
          <a class="w3-bar-item w3-button" href='/xml/xquery_intro.asp'>Learn XQuery</a>
        </div>
      </div>
      <br>
    </div>
    <div id='nav_references' class='w3-bar-block w3-card-2'>
      <span onclick='w3_close_nav("references")' class='w3-button w3-xlarge w3-right' style="position:absolute;right:0;font-weight:bold;">&times;</span>
      <div class='w3-row-padding' style="padding:24px 48px">
        <div class='w3-col m4'>
          <h3>HTML</h3>
          <a class="w3-bar-item w3-button" href='/tags/default.asp'>HTML Tag Reference</a>
          <a class="w3-bar-item w3-button" href='/tags/ref_eventattributes.asp'>HTML Event Reference</a>
          <a class="w3-bar-item w3-button" href='/colors/default.asp'>HTML Color Reference</a>
          <a class="w3-bar-item w3-button" href='/tags/ref_attributes.asp'>HTML Attribute Reference</a>
          <a class="w3-bar-item w3-button" href='/tags/ref_canvas.asp'>HTML Canvas Reference</a>
          <a class="w3-bar-item w3-button" href='/graphics/svg_reference.asp'>HTML SVG Reference</a>
          <a class="w3-bar-item w3-button" href='/graphics/google_maps_reference.asp'>Google Maps Reference</a>
          <h3>Charsets</h3>
          <a class="w3-bar-item w3-button" href='/charsets/default.asp'>HTML Character Sets</a>
          <a class="w3-bar-item w3-button" href='/charsets/ref_html_ascii.asp'>HTML ASCII</a>
          <a class="w3-bar-item w3-button" href='/charsets/ref_html_ansi.asp'>HTML ANSI</a>
          <a class="w3-bar-item w3-button" href='/charsets/ref_html_ansi.asp'>HTML Windows-1252</a>
          <a class="w3-bar-item w3-button" href='/charsets/ref_html_8859.asp'>HTML ISO-8859-1</a>
          <a class="w3-bar-item w3-button" href='/charsets/ref_html_symbols.asp'>HTML Symbols</a>
          <a class="w3-bar-item w3-button" href='/charsets/ref_html_utf8.asp'>HTML UTF-8</a>
        </div>
        <div class='w3-col m4'>
          <h3>CSS</h3>
          <a class="w3-bar-item w3-button" href='/cssref/default.asp'>CSS Reference</a>
          <a class="w3-bar-item w3-button" href='/cssref/css3_browsersupport.asp'>CSS Browser Support</a>
          <a class="w3-bar-item w3-button" href='/cssref/css_selectors.asp'>CSS Selector Reference</a>
          <a class="w3-bar-item w3-button" href='/w3css/w3css_references.asp'>W3.CSS Reference</a>
          <a class="w3-bar-item w3-button" href='/bootstrap/bootstrap_ref_all_classes.asp'>Bootstrap Reference</a>
          <a class="w3-bar-item w3-button" href='/icons/icons_reference.asp'>Icon Reference</a>
          <h3>XML</h3>
          <a class="w3-bar-item w3-button" href='/xml/dom_nodetype.asp'>XML Reference</a>
          <a class="w3-bar-item w3-button" href='/xml/dom_http.asp'>XML Http Reference</a>
          <a class="w3-bar-item w3-button" href='/xml/xsl_elementref.asp'>XSLT Reference</a>
          <a class="w3-bar-item w3-button" href='/xml/schema_elements_ref.asp'>XML Schema Reference</a>
        </div>
        <div class='w3-col m4'>
          <h3>JavaScript</h3>
          <a class="w3-bar-item w3-button" href='/jsref/default.asp'>JavaScript Reference</a>
          <a class="w3-bar-item w3-button" href='/jsref/default.asp'>HTML DOM Reference</a>
          <a class="w3-bar-item w3-button" href='/jquery/jquery_ref_overview.asp'>jQuery Reference</a>
          <a class="w3-bar-item w3-button" href='/angular/angular_ref_directives.asp'>AngularJS Reference</a>
          <a class="w3-bar-item w3-button" href="/w3js/w3js_references.asp">W3.JS Reference</a>
          <h3>Server Side</h3>
          <a class="w3-bar-item w3-button" href='/php/php_ref_overview.asp'>PHP Reference</a>
          <a class="w3-bar-item w3-button" href='/sql/sql_quickref.asp'>SQL Reference</a>
          <a class="w3-bar-item w3-button" href='/python/python_reference.asp'>Python Reference</a>
          <a class="w3-bar-item w3-button" href='/asp/asp_ref_response.asp'>ASP Reference</a>
        </div>
      </div>
      <br>
    </div>
    <div id='nav_examples' class='w3-bar-block w3-card-2'>
      <span onclick='w3_close_nav("examples")' class='w3-button w3-xlarge w3-right' style="position:absolute;right:0;font-weight:bold;">&times;</span>
      <div class='w3-row-padding' style="padding:24px 48px">
        <div class='w3-col l3 m6'>
          <h3>HTML/CSS</h3>
          <a class="w3-bar-item w3-button" href='/html/html_examples.asp'>HTML Examples</a>
          <a class="w3-bar-item w3-button" href='/css/css_examples.asp'>CSS Examples</a>
          <a class="w3-bar-item w3-button" href='/w3css/w3css_examples.asp'>W3.CSS Examples</a>
          <a class="w3-bar-item w3-button" href='/w3css/w3css_templates.asp'>W3.CSS Templates</a>
          <a class="w3-bar-item w3-button" href='/bootstrap/bootstrap_examples.asp'>Bootstrap Examples</a>
          <a class="w3-bar-item w3-button" href='/howto/default.asp'>How To Examples</a>
          <a class="w3-bar-item w3-button" href='/graphics/svg_examples.asp'>SVG Examples</a>
        </div>
        <div class='w3-col l3 m6'>
          <h3>JavaScript</h3>
          <a class="w3-bar-item w3-button" href='/js/js_examples.asp' target='_top'>JavaScript Examples</a>
          <a class="w3-bar-item w3-button" href='/js/js_dom_examples.asp' target='_top'>HTML DOM Examples</a>
          <a class="w3-bar-item w3-button" href='/jquery/jquery_examples.asp' target='_top'>jQuery Examples</a>
          <a class="w3-bar-item w3-button" href='/angular/angular_examples.asp' target='_top'>AngularJS Examples</a>
          <a class="w3-bar-item w3-button" href='/js/js_ajax_examples.asp' target='_top'>AJAX Examples</a>
          <a class="w3-bar-item w3-button" href="/w3js/w3js_examples.asp">W3.JS Examples</a>
        </div>
        <div class='w3-col l3 m6'>
          <h3>Server Side</h3>
          <a class="w3-bar-item w3-button" href='/php/php_examples.asp' target='_top'>PHP Examples</a>
          <a class="w3-bar-item w3-button" href="/asp/asp_examples.asp" target="_top">ASP Examples</a>
          <h3>XML</h3>
          <a class="w3-bar-item w3-button" href='/xml/xml_examples.asp' target='_top'>XML Examples</a>
          <a class="w3-bar-item w3-button" href='/xml/xsl_examples.asp' target='_top'>XSLT Examples</a>
          <a class="w3-bar-item w3-button" href='/xml/xpath_examples.asp' target='_top'>XPath Examples</a>
          <a class="w3-bar-item w3-button" href='/xml/schema_example.asp' target='_top'>XML Schema Examples</a>
          <a class="w3-bar-item w3-button" href='/graphics/svg_examples.asp' target='_top'>SVG Examples</a>
        </div>
        <div class='w3-col l3 m6'>
          <h3>Quizzes</h3>
          <a class="w3-bar-item w3-button" href='/quiztest/quiztest.asp?Qtest=HTML' target='_top'>HTML Quiz</a>
          <a class="w3-bar-item w3-button" href='/quiztest/quiztest.asp?Qtest=CSS' target='_top'>CSS Quiz</a>
          <a class="w3-bar-item w3-button" href='/quiztest/quiztest.asp?Qtest=JavaScript' target='_top'>JavaScript Quiz</a>
          <a class="w3-bar-item w3-button" href='/quiztest/quiztest.asp?Qtest=Bootstrap' target='_top'>Bootstrap Quiz</a>
          <a class="w3-bar-item w3-button" href='/quiztest/quiztest.asp?Qtest=jQuery' target='_top'>jQuery Quiz</a>
          <a class="w3-bar-item w3-button" href='/quiztest/quiztest.asp?Qtest=PHP' target='_top'>PHP Quiz</a>
          <a class="w3-bar-item w3-button" href="/quiztest/quiztest.asp?Qtest=SQL" target="_top">SQL Quiz</a>
          <a class="w3-bar-item w3-button" href='/quiztest/quiztest.asp?Qtest=XML' target='_top'>XML Quiz</a>
        </div>
      </div>
      <br>
    </div>
  </div>
</div>

<div class='w3-sidebar w3-collapse' id='sidenav'>
  <div id='leftmenuinner'>
    <div class='w3-light-grey' id='leftmenuinnerinner'>
      <a href='javascript:void(0)' onclick='close_menu()' class='w3-button w3-hide-large w3-large w3-display-topright' style='right:16px;padding:3px 12px;font-weight:bold;'>&times;</a>
<h2 class="left"><span class="left_h2">HTML5</span> Tutorial</h2>
<a target="_top" href="default.asp">HTML HOME</a>
<a target="_top" href="html_intro.asp">HTML Introduction</a>
<a target="_top" href="html_editors.asp">HTML Editors</a>
<a target="_top" href="html_basic.asp">HTML Basic</a>
<a target="_top" href="html_elements.asp">HTML Elements</a>
<a target="_top" href="html_attributes.asp">HTML Attributes</a>
<a target="_top" href="html_headings.asp">HTML Headings</a>
<a target="_top" href="html_paragraphs.asp">HTML Paragraphs</a>
<a target="_top" href="html_styles.asp">HTML Styles</a>
<a target="_top" href="html_formatting.asp">HTML Formatting</a>
<a target="_top" href="html_quotation_elements.asp">HTML Quotations</a>
<a target="_top" href="html_comments.asp">HTML Comments</a>
<a target="_top" href="html_colors.asp">HTML Colors</a>
<a target="_top" href="html_css.asp">HTML CSS</a>
<a target="_top" href="html_links.asp">HTML Links</a>
<a target="_top" href="html_images.asp">HTML Images</a>
<a target="_top" href="html_tables.asp">HTML Tables</a>
<a target="_top" href="html_lists.asp">HTML Lists</a>
<a target="_top" href="html_blocks.asp">HTML Blocks</a>
<a target="_top" href="html_classes.asp">HTML Classes</a>
<a target="_top" href="html_id.asp">HTML Id</a>
<a target="_top" href="html_iframe.asp">HTML Iframes</a>
<a target="_top" href="html_scripts.asp">HTML JavaScript</a>
<a target="_top" href="html_filepaths.asp">HTML File Paths</a>
<a target="_top" href="html_head.asp">HTML Head</a>
<a target="_top" href="html_layout.asp">HTML Layout</a>
<a target="_top" href="html_responsive.asp">HTML Responsive</a>
<a target="_top" href="html_computercode_elements.asp">HTML Computercode</a>
<a target="_top" href="html_entities.asp">HTML Entities</a>
<a target="_top" href="html_symbols.asp">HTML Symbols</a>
<a target="_top" href="html_charset.asp">HTML Charset</a>
<a target="_top" href="html_urlencode.asp">HTML URL Encode</a>
<a target="_top" href="html_xhtml.asp">HTML XHTML</a>
<br>
<h2 class="left"><span class="left_h2">HTML</span> Forms</h2>
<a target="_top" href="html_forms.asp">HTML Forms</a>
<a target="_top" href="html_form_elements.asp">HTML Form Elements</a>
<a target="_top" href="html_form_input_types.asp">HTML Input Types</a>
<a target="_top" href="html_form_attributes.asp">HTML Input Attributes</a>
<br>
<h2 class="left"><span class="left_h2">HTML5</span></h2>
<a target="_top" href="html5_intro.asp">HTML5 Intro</a>
<a target="_top" href="html5_browsers.asp">HTML5 Support</a>
<a target="_top" href="html5_new_elements.asp">HTML5 New Elements</a>
<a target="_top" href="html5_semantic_elements.asp">HTML5 Semantics</a>
<a target="_top" href="html5_migration.asp">HTML5 Migration</a>
<a target="_top" href="html5_syntax.asp">HTML5 Style Guide</a>
<br>
<h2 class="left"><span class="left_h2">HTML</span> Graphics</h2>
<a target="_top" href="html5_canvas.asp">HTML Canvas</a>
<a target="_top" href="html5_svg.asp">HTML SVG</a>
<a target="_top" href="html_googlemaps.asp">HTML Google Maps</a>
<br>
<h2 class="left"><span class="left_h2">HTML</span> Media</h2>
<a target="_top" href="html_media.asp">HTML Media</a>
<a target="_top" href="html5_video.asp">HTML Video</a>
<a target="_top" href="html5_audio.asp">HTML Audio</a>
<a target="_top" href="html_object.asp">HTML Plug-ins</a>
<a target="_top" href="html_youtube.asp">HTML YouTube</a>
<br>
<h2 class="left"><span class="left_h2">HTML</span> APIs</h2>
<a target="_top" href="html5_geolocation.asp">HTML Geolocation</a>
<a target="_top" href="html5_draganddrop.asp">HTML Drag/Drop</a>
<a target="_top" href="html5_webstorage.asp">HTML Web Storage</a>
<a target="_top" href="html5_webworkers.asp">HTML Web Workers</a>
<a target="_top" href="html5_serversentevents.asp">HTML SSE</a>
<br>
<h2 class="left"><span class="left_h2">HTML</span> Examples</h2>
<a target="_top" href="html_examples.asp">HTML Examples</a>
<a target="_top" href="html_quiz.asp">HTML Quiz</a>
<a target="_top" href="html_exercises.asp">HTML Exercises</a>
<a target="_top" href="html_exam.asp">HTML Certificate</a>
<a target="_top" href="html_summary.asp">HTML Summary</a>
<a target="_top" href="html_accessibility.asp">HTML Accessibility</a>
<br>
<h2 class="left"><span class="left_h2">HTML</span> References</h2>
<a target="_top" href="/tags/default.asp">HTML Tag List</a>
<a target="_top" href="/tags/ref_standardattributes.asp">HTML Attributes</a>
<a target="_top" href="/tags/ref_eventattributes.asp">HTML Events</a>
<a target="_top" href="/tags/ref_colornames.asp">HTML Colors</a>
<a target="_top" href="/tags/ref_canvas.asp">HTML Canvas</a>
<a target="_top" href="/tags/ref_av_dom.asp">HTML Audio/Video</a>
<a target="_top" href="/tags/ref_html_dtd.asp">HTML Doctypes</a>
<a target="_top" href="/tags/ref_charactersets.asp">HTML Character Sets</a>
<a target="_top" href="/tags/ref_urlencode.asp">HTML URL Encode</a>
<a target="_top" href="/tags/ref_language_codes.asp">HTML Lang Codes</a>
<a target="_top" href="/tags/ref_httpmessages.asp">HTTP Messages</a>
<a target="_top" href="/tags/ref_httpmethods.asp">HTTP Methods</a>
<a target="_top" href="/tags/ref_pxtoemconversion.asp">PX to EM Converter</a>
<a target="_top" href="/tags/ref_keyboardshortcuts.asp">Keyboard Shortcuts</a>
      <br><br>
    </div>
  </div>
</div>
<div class='w3-main w3-light-grey' id='belowtopnav' style='margin-left:220px;'>
  <div class='w3-row w3-white'>
    <div class='w3-col l10 m12' id='main'>
      <div id='mainLeaderboard' style='overflow:hidden;'>
        <!-- MainLeaderboard-->

        <!--<pre>main_leaderboard, all: [728,90][970,90][320,50][468,60]</pre>-->
        <div id="snhb-main_leaderboard-0"></div>
       
      </div>
<h1>HTML <span class="color_h1">File Paths</span></h1>
<div class="w3-clear nextprev">
  <a class="w3-left w3-btn" href="html_scripts.asp">&#10094; Previous</a>
  <a class="w3-right w3-btn" href="html_head.asp">Next &#10095;</a>
</div>
<hr>


<table class="w3-table-all">
<tr><th style="width:280px">Path</th><th>Description</th></tr>
<tr>
<td>&lt;img src=&quot;picture.jpg&quot;&gt;</td>
<td>picture.jpg is located in the same folder as the current page</td>
</tr>
<tr>
<td>&lt;img src=&quot;images/picture.jpg&quot;&gt;</td>
<td>picture.jpg is located in the images folder in the current folder</td>
</tr>
<tr>
<td>&lt;img src=&quot;/images/picture.jpg&quot;&gt;</td>
<td>picture.jpg is located in the images folder at the root of the current web</td>
</tr>
<tr>
<td>&lt;img src=&quot;../picture.jpg&quot;&gt;</td>
<td>picture.jpg is located in the folder one level up from the current folder</td>
</tr>
</table>

<hr>

<h2>HTML File Paths</h2>
<p>A file path describes the location of a file in a web site's folder structure.</p>

<p>File paths are used when linking to external files like:</p>
<ul>
  <li>Web pages</li>
  <li>Images</li>
  <li>Style sheets</li>
  <li>JavaScripts</li>
</ul>
<hr>

<h2>Absolute File Paths</h2>
<p>An absolute file path is the full URL to an internet file:</p>
<div class="w3-example">
<h3>Example</h3>
<div class="w3-code notranslate htmlHigh">
&lt;img src=&quot;https://www.w3schools.com/images/picture.jpg&quot; 
  alt=&quot;Mountain&quot;&gt;
</div>
<p><a class="w3-btn" href="tryit.asp?filename=tryhtml_files_absoulute" target="_blank">Try it Yourself &raquo;</a></p>
</div>
<div class="w3-panel w3-note">
<p>The &lt;img&gt; tag and the src and alt attributes are explained in the chapter 
about <a href="html_images.asp">HTML Images</a>.</p>
</div>
<hr>

<h2>Relative File Paths</h2>
<p>A relative file path points to a file relative to the current page.</p>
<p>In this example, the file path points to a file in the images folder located 
at the root of the current web:</p>
<div class="w3-example">
<h3>Example</h3>
<div class="w3-code notranslate htmlHigh">
&lt;img src=&quot;/images/picture.jpg&quot; 
alt=&quot;Mountain&quot;&gt;
</div>
<p><a class="w3-btn" href="tryit.asp?filename=tryhtml_files_relative" target="_blank">Try it Yourself &raquo;</a></p>
</div>

<p>In this example, the file path points to a file in the images folder located in the 
current folder:</p>
<div class="w3-example">
<h3>Example</h3>
<div class="w3-code notranslate htmlHigh">
&lt;img src=&quot;images/picture.jpg&quot; 
alt=&quot;Mountain&quot;&gt;
</div>
<p>
<a class="w3-btn" href="tryit.asp?filename=tryhtml_files_relative_1" target="_blank">Try it Yourself &raquo;</a></p>
</div>

<p>In this example, the file path points to a file in the images folder located in the 
folder one level above the current folder:</p>
<div class="w3-example">
<h3>Example</h3>
<div class="w3-code notranslate htmlHigh">
&lt;img src=&quot;../images/picture.jpg&quot; 
alt=&quot;Mountain&quot;&gt;
</div>
<p>
<a class="w3-btn" href="tryit.asp?filename=tryhtml_files_relative_2" target="_blank">Try it Yourself &raquo;</a></p>
</div>

<hr>

<h2>Best Practice</h2>
<p>It is best practice to use relative file paths (if possible).</p>
<p>When using relative file paths, your web pages will not be bound to your current 
base URL. All links will work on your own computer (localhost) as well as on 
your current public domain and your future public domains.&nbsp; </p>

<br>
<div class="w3-clear nextprev">
  <a class="w3-left w3-btn" href="html_scripts.asp">&#10094; Previous</a>
  <a class="w3-right w3-btn" href="html_head.asp">Next &#10095;</a>
</div>
</div>
<div class="w3-col l2 m12" id="right">

<div class="sidesection">
  <div id="skyscraper">
  
    <!--<pre>wide_skyscraper, all: [160,600][300,600][320,50][120,600][300,1050]</pre>-->
    <div id="snhb-wide_skyscraper-0"></div>
  
  </div>
</div>

<div class="sidesection">
<h4><a href="/colors/colors_picker.asp">COLOR PICKER</a></h4>
<a href="/colors/colors_picker.asp">
<img src="/images/colorpicker.gif" alt="colorpicker"></a>
</div>

<div class="sidesection" id="moreAboutSubject">
</div>

<div class="sidesection w3-light-grey" style="margin-left:auto;margin-right:auto;max-width:230px">
<div class="w3-container w3-dark-grey">
<h4><a href="/howto/default.asp" class="w3-hover-text-white">HOW TO</a></h4>
</div>
<div class="w3-container w3-left-align w3-padding-16">
<a href="/howto/howto_js_tabs.asp">Tabs</a><br>
<a href="/howto/howto_css_dropdown.asp">Dropdowns</a><br>
<a href="/howto/howto_js_accordion.asp">Accordions</a><br>
<a href="/howto/howto_js_sidenav.asp">Side Navigation</a><br>
<a href="/howto/howto_js_topnav.asp">Top Navigation</a><br>
<a href="/howto/howto_css_modals.asp">Modal Boxes</a><br>
<a href="/howto/howto_js_progressbar.asp">Progress Bars</a><br>
<a href="/howto/howto_css_parallax.asp">Parallax</a><br>
<a href="/howto/howto_css_login_form.asp">Login Form</a><br>
<a href="/howto/howto_html_include.asp">HTML Includes</a><br>
<a href="/howto/howto_google_maps.asp">Google Maps</a><br>
<a href="/howto/howto_js_rangeslider.asp">Range Sliders</a><br>
<a href="/howto/howto_css_tooltip.asp">Tooltips</a><br>
<a href="/howto/howto_js_slideshow.asp">Slideshow</a><br>
<a href="/howto/howto_js_filter_lists.asp">Filter List</a><br>
<a href="/howto/howto_js_sort_list.asp">Sort List</a><br>
</div>
</div>


<div class="sidesection">
<h4>SHARE</h4>
<div class="w3-text-grey sharethis">
<script>
<!--
try{
loc=location.pathname;
if (loc.toUpperCase().indexOf(".ASP")<0) loc=loc+"default.asp";
txt='<a href="http://www.facebook.com/sharer.php?u=https://www.w3schools.com'+loc+'" target="_blank" title="Facebook"><span class="fa fa-facebook-square fa-2x"></span></a>';
txt=txt+'<a href="https://twitter.com/home?status=Currently reading https://www.w3schools.com'+loc+'" target="_blank" title="Twitter"><span class="fa fa-twitter-square fa-2x"></span></a>';
txt=txt+'<a href="https://plus.google.com/share?url=https://www.w3schools.com'+loc+'" target="_blank" title="Google+"><span class="fa fa-google-plus-square fa-2x"></span></a>';
document.write(txt);
} catch(e) {}
//-->
</script>
<br><br>
<a href="javascript:void(0);" onclick="clickFBLike()" title="Like W3Schools on Facebook">
<span class="fa fa-thumbs-o-up fa-2x"></span></a>
<div id="fblikeframe" class="w3-modal">
<div class="w3-modal-content w3-padding-64 w3-animate-zoom" id="popupDIV"></div>
</div>
</div>
</div>

<div class="sidesection">
<h4><a target="_blank" href="//www.w3schools.com/cert/default.asp">CERTIFICATES</a></h4>
<p>
<a href="/cert/cert_html.asp">HTML</a>,
<a href="/cert/cert_css.asp">CSS</a>,
<a href="/cert/cert_javascript.asp">JavaScript</a>,
<a href="/cert/cert_php.asp">PHP</a>,
<a href="/cert/cert_jquery.asp">jQuery</a>,
<a href="/cert/cert_bootstrap.asp">Bootstrap</a> and
<a href="/cert/cert_xml.asp">XML</a>.</p>
<a target="_blank" href="//www.w3schools.com/cert/default.asp" class="w3-button w3-dark-grey" style="text-decoration:none">
Read More &raquo;</a>
</div>

<div id="stickypos" class="sidesection" style="text-align:center;position:sticky;top:50px;">
  <div id="stickyadcontainer">
    <div style="position:relative;margin:auto;">
      
      <!--<pre>sidebar_sticky, desktop: [120,600][160,600][300,600][300,250]</pre>-->
      <div id="snhb-sidebar_sticky-0"></div>
      <script>
          if (Number(w3_getStyleValue(document.getElementById("main"), "height").replace("px", "")) > 2200) {
            if (document.getElementById("snhb-mid_content-0")) {
              snhb.queue.push(function(){  snhb.startAuction(["sidebar_sticky", "mid_content" ]); });
            }
            else {
              snhb.queue.push(function(){  snhb.startAuction(["sidebar_sticky"]); });
            }
          }
          else {
              if (document.getElementById("snhb-mid_content-0")) {
                snhb.queue.push(function(){  snhb.startAuction(["mid_content"]); });
              }
          }
      </script>  
      
    </div>
  </div>
</div>

<script>
  window.addEventListener("scroll", fix_stickyad);
  window.addEventListener("resize", fix_stickyad);
</script>

</div>
</div>
<div id="footer" class="footer w3-container w3-white">

<hr>

<div style="overflow:auto">
  <div class="bottomad">
    <!-- BottomMediumRectangle -->
    <!--<pre>bottom_medium_rectangle, all: [970,250][300,250][336,280]</pre>-->
    <div id="snhb-bottom_medium_rectangle-0" style="padding:0 10px 10px 0;float:left;width:auto;"></div>
    <!-- RightBottomMediumRectangle -->
    <!--<pre>right_bottom_medium_rectangle, desktop: [300,250][336,280]</pre>-->
    <div id="snhb-right_bottom_medium_rectangle-0" style="padding:0 10px 10px 0;float:left;width:auto;"></div>
  </div>
</div>

<hr>
<div class="w3-row w3-center w3-small">
<div class="w3-col l3 m3 s12">
<a href="javascript:void(0);" onclick="displayError();return false" style="white-space:nowrap;">REPORT ERROR</a>
</div>
<div class="w3-col l3 m3 s12">
<a href="javascript:void(0);" target="_blank" onclick="printPage();return false;">PRINT PAGE</a>
</div>
<div class="w3-col l3 m3 s12">
<a href="/forum/default.asp" target="_blank">FORUM</a>
</div>
<div class="w3-col l3 m3 s12">
<a href="/about/default.asp" target="_top">ABOUT</a>
</div>
</div>
<hr>
<div class="w3-light-grey w3-padding w3-center" id="err_form" style="display:none;position:relative">
<span onclick="this.parentElement.style.display='none'" class="w3-button w3-display-topright">&times;</span>     
<h2>Your Suggestion:</h2>
<form>
<div class="w3-section">      
<label for="err_email">Your E-mail:</label>
<input class="w3-input" type="text" style="width:100%" id="err_email" name="err_email">
</div>
<div class="w3-section">      
<label for="err_email">Page address:</label>
<input class="w3-input" type="text" style="width:100%" id="err_url" name="err_url" disabled="disabled">
</div>
<div class="w3-section">
<label for="err_email">Description:</label>
<textarea rows="10" class="w3-input" id="err_desc" name="err_desc" style="width:100%;"></textarea>
</div>
<div class="form-group">        
<button type="button" onclick="sendErr()">Submit</button>
</div>
<br>
</form>
</div>
<div class="w3-container w3-light-grey w3-padding" id="err_sent" style="display:none;position:relative">
<span onclick="this.parentElement.style.display='none'" class="w3-button w3-display-topright">&times;</span>     
<h2>Thank You For Helping Us!</h2>
<p>Your message has been sent to W3Schools.</p>
</div>

<div class="w3-row w3-center w3-small">
<div class="w3-col l3 m6 s12">
<div class="top10">
<h4>Top 10 Tutorials</h4>
<a href="/html/default.asp">HTML Tutorial</a><br>
<a href="/css/default.asp">CSS Tutorial</a><br>
<a href="/js/default.asp">JavaScript Tutorial</a><br>
<a href="/howto/default.asp">How To Tutorial</a><br>
<a href="/w3css/default.asp">W3.CSS Tutorial</a><br>
<a href="/bootstrap/default.asp">Bootstrap Tutorial</a><br>
<a href="/sql/default.asp">SQL Tutorial</a><br>
<a href="/php/default.asp">PHP Tutorial</a><br>
<a href="/jquery/default.asp">jQuery Tutorial</a><br>
<a href="/python/default.asp">Python Tutorial</a><br>
</div>
</div>
<div class="w3-col l3 m6 s12">
<div class="top10">
<h4>Top 10 References</h4>
<a href="/tags/default.asp">HTML Reference</a><br>
<a href="/cssref/default.asp">CSS Reference</a><br>
<a href="/jsref/default.asp">JavaScript Reference</a><br>
<a href="/w3css/w3css_references.asp">W3.CSS Reference</a><br>
<a href="/bootstrap/bootstrap_ref_all_classes.asp">Bootstrap Reference</a><br>
<a href="/sql/sql_ref_mysql.asp">SQL Reference</a><br>
<a href="/php/php_ref_overview.asp">PHP Reference</a><br>
<a href="/colors/colors_names.asp">HTML Colors</a><br>
<a href="/jquery/jquery_ref_overview.asp">jQuery Reference</a><br>
<a href="/python/python_reference.asp">Python Reference</a><br>
</div>
</div>
<div class="w3-col l3 m6 s12">
<div class="top10">
<h4>Top 10 Examples</h4>
<a href="/html/html_examples.asp">HTML Examples</a><br>
<a href="/css/css_examples.asp">CSS Examples</a><br>
<a href="/js/js_examples.asp">JavaScript Examples</a><br>
<a href="/howto/default.asp">How To Examples</a><br>
<a href="/w3css/w3css_examples.asp">W3.CSS Examples</a><br>
<a href="/bootstrap/bootstrap_examples.asp">Bootstrap Examples</a><br>
<a href="/php/php_examples.asp">PHP Examples</a><br>
<a href="/jquery/jquery_examples.asp">jQuery Examples</a><br>
<a href="/angular/angular_examples.asp">Angular Examples</a><br>
<a href="/xml/xml_examples.asp">XML Examples</a><br>
</div>
</div>
<div class="w3-col l3 m6 s12">
<div class="top10">
<h4>Web Certificates</h4>
<a href="/cert/default.asp">HTML Certificate</a><br>
<a href="/cert/default.asp">CSS Certificate</a><br>
<a href="/cert/default.asp">JavaScript Certificate</a><br>
<a href="/cert/default.asp">jQuery Certificate</a><br>
<a href="/cert/default.asp">PHP Certificate</a><br>
<a href="/cert/default.asp">Bootstrap Certificate</a><br>
<a href="/cert/default.asp">XML Certificate</a><br>
</div>
</div>        
</div>        

<hr>
<div class="w3-center w3-small w3-opacity">
W3Schools is optimized for learning, testing, and training. Examples might be simplified to improve reading and basic understanding.
Tutorials, references, and examples are constantly reviewed to avoid errors, but we cannot warrant full correctness of all content.
While using this site, you agree to have read and accepted our <a href="/about/about_copyright.asp">terms of use</a>,
<a href="/about/about_privacy.asp">cookie and privacy policy</a>.
<a href="/about/about_copyright.asp">Copyright 1999-2018</a> by Refsnes Data. All Rights Reserved.<br>
 <a href="//www.w3schools.com/w3css/">Powered by W3.CSS</a>.<br><br>
<a href="//www.w3schools.com">
<img style="width:150px;height:28px;border:0" src="/images/w3schoolscom_gray.gif" alt="W3Schools.com"></a>
</div>
<br><br>
</div>

</div>

<script src="/lib/snigel_w3schools_footer.js"></script>

<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>  
<![endif]-->
</body>
</html>
`,
'script.js': `/* eslint-disable no-sequences */
import React from 'react';
import ReactDOM from 'react-dom';
import './sass/main.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import {
  consoleImage,
  consoleWarnText,
} from 'utils';

import {
  consoleWarnDefaultText,
  url,
} from 'config';

import registerServiceWorker from './registerServiceWorker';

process.env.NODE_ENV === 'production' && Promise.resolve().then(_ => (
  consoleWarnText(consoleWarnDefaultText),
  consoleImage(url.console_image_why)
));

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();`,
'style.css': `.searchbox {
  display: inline-block;
  position: relative;
  width: 200px;
  height: 32px !important;
  white-space: nowrap;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  visibility: visible !important;
}

.searchbox .algolia-autocomplete {
  display: block;
  width: 100%;
  height: 100%;
}

.searchbox__wrapper {
  width: 100%;
  height: 100%;
  z-index: 999;
  position: relative;
}

.searchbox__input {
  display: inline-block;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  -webkit-transition: background .4s ease, -webkit-box-shadow .4s ease;
  transition: background .4s ease, -webkit-box-shadow .4s ease;
  transition: box-shadow .4s ease, background .4s ease;
  transition: box-shadow .4s ease, background .4s ease, -webkit-box-shadow .4s ease;
  border: 0;
  border-radius: 16px;
  -webkit-box-shadow: inset 0 0 0 1px #CCCCCC;
          box-shadow: inset 0 0 0 1px #CCCCCC;
  background: #FFFFFF !important;
  padding: 0;
  padding-right: 26px;
  padding-left: 32px;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  white-space: normal;
  font-size: 12px;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

.searchbox__input::-webkit-search-decoration, .searchbox__input::-webkit-search-cancel-button, .searchbox__input::-webkit-search-results-button, .searchbox__input::-webkit-search-results-decoration {
  display: none;
}

.searchbox__input:hover {
  -webkit-box-shadow: inset 0 0 0 1px #b3b3b3;
          box-shadow: inset 0 0 0 1px #b3b3b3;
}

.searchbox__input:focus, .searchbox__input:active {
  outline: 0;
  -webkit-box-shadow: inset 0 0 0 1px #AAAAAA;
          box-shadow: inset 0 0 0 1px #AAAAAA;
  background: #FFFFFF;
}

.searchbox__input::-webkit-input-placeholder {
  color: #AAAAAA;
}

.searchbox__input:-ms-input-placeholder {
  color: #AAAAAA;
}

.searchbox__input::-ms-input-placeholder {
  color: #AAAAAA;
}

.searchbox__input::placeholder {
  color: #AAAAAA;
}

.searchbox__submit {
  position: absolute;
  top: 0;
  margin: 0;
  border: 0;
  border-radius: 16px 0 0 16px;
  background-color: rgba(69, 142, 225, 0);
  padding: 0;
  width: 32px;
  height: 100%;
  vertical-align: middle;
  text-align: center;
  font-size: inherit;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  right: inherit;
  left: 0;
}

.searchbox__submit::before {
  display: inline-block;
  margin-right: -4px;
  height: 100%;
  vertical-align: middle;
  content: '';
}

.searchbox__submit:hover, .searchbox__submit:active {
  cursor: pointer;
}

.searchbox__submit:focus {
  outline: 0;
}

.searchbox__submit svg {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  fill: #6D7E96;
}

.searchbox__reset {
  display: block;
  position: absolute;
  top: 8px;
  right: 8px;
  margin: 0;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  fill: rgba(0, 0, 0, 0.5);
}

.searchbox__reset.hide {
  display: none;
}

.searchbox__reset:focus {
  outline: 0;
}

.searchbox__reset svg {
  display: block;
  margin: 4px;
  width: 8px;
  height: 8px;
}

.searchbox__input:valid ~ .searchbox__reset {
  display: block;
  -webkit-animation-name: sbx-reset-in;
          animation-name: sbx-reset-in;
  -webkit-animation-duration: .15s;
          animation-duration: .15s;
}

@-webkit-keyframes sbx-reset-in {
  0% {
    -webkit-transform: translate3d(-20%, 0, 0);
            transform: translate3d(-20%, 0, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
            transform: none;
    opacity: 1;
  }
}

@keyframes sbx-reset-in {
  0% {
    -webkit-transform: translate3d(-20%, 0, 0);
            transform: translate3d(-20%, 0, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
            transform: none;
    opacity: 1;
  }
}

.algolia-autocomplete.algolia-autocomplete-right .ds-dropdown-menu {
  right: 0 !important;
  left: inherit !important;
}

.algolia-autocomplete.algolia-autocomplete-right .ds-dropdown-menu:before {
  right: 48px;
}

.algolia-autocomplete.algolia-autocomplete-left .ds-dropdown-menu {
  left: 0 !important;
  right: inherit !important;
}

.algolia-autocomplete.algolia-autocomplete-left .ds-dropdown-menu:before {
  left: 48px;
}

.algolia-autocomplete .ds-dropdown-menu {
  position: relative;
  top: -6px;
  border-radius: 4px;
  margin: 6px 0 0;
  padding: 0;
  text-align: left;
  height: auto;
  position: relative;
  background: transparent;
  border: none;
  z-index: 999;
  max-width: 600px;
  min-width: 500px;
  -webkit-box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.1);
          box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.1);
}

.algolia-autocomplete .ds-dropdown-menu:before {
  display: block;
  position: absolute;
  content: '';
  width: 14px;
  height: 14px;
  background: #fff;
  z-index: 1000;
  top: -7px;
  border-top: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
  border-radius: 2px;
}

.algolia-autocomplete .ds-dropdown-menu .ds-suggestions {
  position: relative;
  z-index: 1000;
  margin-top: 8px;
}

.algolia-autocomplete .ds-dropdown-menu .ds-suggestion {
  cursor: pointer;
}

.algolia-autocomplete .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion.suggestion-layout-simple {
  background-color: rgba(69, 142, 225, 0.05);
}

.algolia-autocomplete .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion:not(.suggestion-layout-simple) .algolia-docsearch-suggestion--content {
  background-color: rgba(69, 142, 225, 0.05);
}

.algolia-autocomplete .ds-dropdown-menu [class^="ds-dataset-"] {
  position: relative;
  border: solid 1px #d9d9d9;
  background: #fff;
  border-radius: 4px;
  overflow: auto;
  padding: 0 8px 8px;
}

.algolia-autocomplete .ds-dropdown-menu * {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

.algolia-autocomplete .algolia-docsearch-suggestion {
  position: relative;
  padding: 0 8px;
  background: #fff;
  color: #02060C;
  overflow: hidden;
}

.algolia-autocomplete .algolia-docsearch-suggestion--highlight {
  color: #174d8c;
  background: rgba(143, 187, 237, 0.1);
  padding: 0.1em 0.05em;
}

.algolia-autocomplete .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl0 .algolia-docsearch-suggestion--highlight,
.algolia-autocomplete .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl1 .algolia-docsearch-suggestion--highlight {
  color: inherit;
  background: inherit;
}

.algolia-autocomplete .algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight {
  padding: 0 0 1px;
  background: inherit;
  -webkit-box-shadow: inset 0 -2px 0 0 rgba(69, 142, 225, 0.8);
          box-shadow: inset 0 -2px 0 0 rgba(69, 142, 225, 0.8);
  color: inherit;
}

.algolia-autocomplete .algolia-docsearch-suggestion--content {
  display: block;
  float: right;
  width: 70%;
  position: relative;
  padding: 5.33333px 0 5.33333px 10.66667px;
  cursor: pointer;
}

.algolia-autocomplete .algolia-docsearch-suggestion--content:before {
  content: '';
  position: absolute;
  display: block;
  top: 0;
  height: 100%;
  width: 1px;
  background: #ddd;
  left: -1px;
}

.algolia-autocomplete .algolia-docsearch-suggestion--category-header {
  position: relative;
  border-bottom: 1px solid #ddd;
  display: none;
  margin-top: 8px;
  padding: 4px 0;
  font-size: 1em;
  color: #33363D;
}

.algolia-autocomplete .algolia-docsearch-suggestion--wrapper {
  width: 100%;
  float: left;
  padding: 8px 0 0 0;
}

.algolia-autocomplete .algolia-docsearch-suggestion--subcategory-column {
  float: left;
  width: 30%;
  padding-left: 0;
  text-align: right;
  position: relative;
  padding: 5.33333px 10.66667px;
  color: #A4A7AE;
  font-size: 0.9em;
  word-wrap: break-word;
}

.algolia-autocomplete .algolia-docsearch-suggestion--subcategory-column:before {
  content: '';
  position: absolute;
  display: block;
  top: 0;
  height: 100%;
  width: 1px;
  background: #ddd;
  right: 0;
}

.algolia-autocomplete .algolia-docsearch-suggestion--subcategory-column .algolia-docsearch-suggestion--highlight {
  background-color: inherit;
  color: inherit;
}

.algolia-autocomplete .algolia-docsearch-suggestion--subcategory-inline {
  display: none;
}

.algolia-autocomplete .algolia-docsearch-suggestion--title {
  margin-bottom: 4px;
  color: #02060C;
  font-size: 0.9em;
  font-weight: bold;
}

.algolia-autocomplete .algolia-docsearch-suggestion--text {
  display: block;
  line-height: 1.2em;
  font-size: 0.85em;
  color: #63676D;
}

.algolia-autocomplete .algolia-docsearch-suggestion--no-results {
  width: 100%;
  padding: 8px 0;
  text-align: center;
  font-size: 1.2em;
}

.algolia-autocomplete .algolia-docsearch-suggestion--no-results::before {
  display: none;
}

.algolia-autocomplete .algolia-docsearch-suggestion code {
  padding: 1px 5px;
  font-size: 90%;
  border: none;
  color: #222222;
  background-color: #EBEBEB;
  border-radius: 3px;
  font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
}

.algolia-autocomplete .algolia-docsearch-suggestion code .algolia-docsearch-suggestion--highlight {
  background: none;
}

.algolia-autocomplete .algolia-docsearch-suggestion.algolia-docsearch-suggestion__main .algolia-docsearch-suggestion--category-header {
  display: block;
}

.algolia-autocomplete .algolia-docsearch-suggestion.algolia-docsearch-suggestion__secondary {
  display: block;
}

@media all and (min-width: 768px) {
  .algolia-autocomplete .algolia-docsearch-suggestion .algolia-docsearch-suggestion--subcategory-column {
    display: block;
  }
}

@media all and (max-width: 768px) {
  .algolia-autocomplete .algolia-docsearch-suggestion .algolia-docsearch-suggestion--subcategory-column {
    display: inline-block;
    width: auto;
    text-align: left;
    float: left;
    padding: 0;
    color: #02060C;
    font-size: 0.9em;
    font-weight: bold;
    text-align: left;
    padding: 0;
    opacity: 0.5;
  }
  .algolia-autocomplete .algolia-docsearch-suggestion .algolia-docsearch-suggestion--subcategory-column:before {
    display: none;
  }
  .algolia-autocomplete .algolia-docsearch-suggestion .algolia-docsearch-suggestion--subcategory-column:after {
    content: "|";
  }
  .algolia-autocomplete .algolia-docsearch-suggestion .algolia-docsearch-suggestion--content {
    display: inline-block;
    width: auto;
    text-align: left;
    float: left;
    padding: 0;
  }
  .algolia-autocomplete .algolia-docsearch-suggestion .algolia-docsearch-suggestion--content:before {
    display: none;
  }
}

.algolia-autocomplete .suggestion-layout-simple.algolia-docsearch-suggestion {
  border-bottom: solid 1px #eee;
  padding: 8px;
  margin: 0;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--content {
  width: 100%;
  padding: 0;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--content::before {
  display: none;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--category-header {
  margin: 0;
  padding: 0;
  display: block;
  width: 100%;
  border: none;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--category-header-lvl0 {
  opacity: .6;
  font-size: 0.85em;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--category-header-lvl1 {
  opacity: .6;
  font-size: 0.85em;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--category-header-lvl1::before {
  background-image: url('data:image/svg+xml;utf8,<svg width="10" height="10" viewBox="0 0 20 38" xmlns="http://www.w3.org/2000/svg"><path d="M1.49 4.31l14 16.126.002-2.624-14 16.074-1.314 1.51 3.017 2.626 1.313-1.508 14-16.075 1.142-1.313-1.14-1.313-14-16.125L3.2.18.18 2.8l1.31 1.51z" fill-rule="evenodd" fill="%231D3657" /></svg>');
  content: '';
  width: 10px;
  height: 10px;
  display: inline-block;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--wrapper {
  width: 100%;
  float: left;
  margin: 0;
  padding: 0;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--duplicate-content, .algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--subcategory-inline {
  display: none !important;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--title {
  margin: 0;
  color: #458EE1;
  font-size: 0.9em;
  font-weight: normal;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--title::before {
  content: "#";
  font-weight: bold;
  color: #458EE1;
  display: inline-block;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--text {
  margin: 4px 0 0;
  display: block;
  line-height: 1.4em;
  padding: 5.33333px 8px;
  background: #f8f8f8;
  font-size: 0.85em;
  opacity: .8;
}

.algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight {
  color: #3f4145;
  font-weight: bold;
  -webkit-box-shadow: none;
          box-shadow: none;
}

.algolia-autocomplete .algolia-docsearch-footer {
  width: 110px;
  height: 20px;
  z-index: 2000;
  margin-top: 10.66667px;
  float: right;
  font-size: 0;
  line-height: 0;
}

.algolia-autocomplete .algolia-docsearch-footer--logo {
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 130 18' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient x1='-36.868%' y1='134.936%' x2='129.432%' y2='-27.7%' id='a'><stop stop-color='%2300AEFF' offset='0%'/><stop stop-color='%233369E7' offset='100%'/></linearGradient></defs><g fill='none' fill-rule='evenodd'><path d='M59.399.022h13.299a2.372 2.372 0 0 1 2.377 2.364V15.62a2.372 2.372 0 0 1-2.377 2.364H59.399a2.372 2.372 0 0 1-2.377-2.364V2.381A2.368 2.368 0 0 1 59.399.022z' fill='url(%23a)'/><path d='M66.257 4.56c-2.815 0-5.1 2.272-5.1 5.078 0 2.806 2.284 5.072 5.1 5.072 2.815 0 5.1-2.272 5.1-5.078 0-2.806-2.279-5.072-5.1-5.072zm0 8.652c-1.983 0-3.593-1.602-3.593-3.574 0-1.972 1.61-3.574 3.593-3.574 1.983 0 3.593 1.602 3.593 3.574a3.582 3.582 0 0 1-3.593 3.574zm0-6.418v2.664c0 .076.082.131.153.093l2.377-1.226c.055-.027.071-.093.044-.147a2.96 2.96 0 0 0-2.465-1.487c-.055 0-.11.044-.11.104l.001-.001zm-3.33-1.956l-.312-.311a.783.783 0 0 0-1.106 0l-.372.37a.773.773 0 0 0 0 1.101l.307.305c.049.049.121.038.164-.011.181-.245.378-.479.597-.697.225-.223.455-.42.707-.599.055-.033.06-.109.016-.158h-.001zm5.001-.806v-.616a.781.781 0 0 0-.783-.779h-1.824a.78.78 0 0 0-.783.779v.632c0 .071.066.12.137.104a5.736 5.736 0 0 1 1.588-.223c.52 0 1.035.071 1.534.207a.106.106 0 0 0 .131-.104z' fill='%23FFF'/><path d='M102.162 13.762c0 1.455-.372 2.517-1.123 3.193-.75.676-1.895 1.013-3.44 1.013-.564 0-1.736-.109-2.673-.316l.345-1.689c.783.163 1.819.207 2.361.207.86 0 1.473-.174 1.84-.523.367-.349.548-.866.548-1.553v-.349a6.374 6.374 0 0 1-.838.316 4.151 4.151 0 0 1-1.194.158 4.515 4.515 0 0 1-1.616-.278 3.385 3.385 0 0 1-1.254-.817 3.744 3.744 0 0 1-.811-1.351c-.192-.539-.29-1.504-.29-2.212 0-.665.104-1.498.307-2.054a3.925 3.925 0 0 1 .904-1.433 4.124 4.124 0 0 1 1.441-.926 5.31 5.31 0 0 1 1.945-.365c.696 0 1.337.087 1.961.191a15.86 15.86 0 0 1 1.588.332v8.456h-.001zm-5.954-4.206c0 .893.197 1.885.592 2.299.394.414.904.621 1.528.621.34 0 .663-.049.964-.142a2.75 2.75 0 0 0 .734-.332v-5.29a8.531 8.531 0 0 0-1.413-.18c-.778-.022-1.369.294-1.786.801-.411.507-.619 1.395-.619 2.223zm16.12 0c0 .719-.104 1.264-.318 1.858a4.389 4.389 0 0 1-.904 1.52c-.389.42-.854.746-1.402.975-.548.229-1.391.36-1.813.36-.422-.005-1.26-.125-1.802-.36a4.088 4.088 0 0 1-1.397-.975 4.486 4.486 0 0 1-.909-1.52 5.037 5.037 0 0 1-.329-1.858c0-.719.099-1.411.318-1.999.219-.588.526-1.09.92-1.509.394-.42.865-.741 1.402-.97a4.547 4.547 0 0 1 1.786-.338 4.69 4.69 0 0 1 1.791.338c.548.229 1.019.55 1.402.97.389.42.69.921.909 1.509.23.588.345 1.28.345 1.999h.001zm-2.191.005c0-.921-.203-1.689-.597-2.223-.394-.539-.948-.806-1.654-.806-.707 0-1.26.267-1.654.806-.394.539-.586 1.302-.586 2.223 0 .932.197 1.558.592 2.098.394.545.948.812 1.654.812.707 0 1.26-.272 1.654-.812.394-.545.592-1.166.592-2.098h-.001zm6.962 4.707c-3.511.016-3.511-2.822-3.511-3.274L113.583.926l2.142-.338v10.003c0 .256 0 1.88 1.375 1.885v1.792h-.001zm3.774 0h-2.153V5.072l2.153-.338v9.534zm-1.079-10.542c.718 0 1.304-.578 1.304-1.291 0-.714-.581-1.291-1.304-1.291-.723 0-1.304.578-1.304 1.291 0 .714.586 1.291 1.304 1.291zm6.431 1.013c.707 0 1.304.087 1.786.262.482.174.871.42 1.156.73.285.311.488.735.608 1.182.126.447.186.937.186 1.476v5.481a25.24 25.24 0 0 1-1.495.251c-.668.098-1.419.147-2.251.147a6.829 6.829 0 0 1-1.517-.158 3.213 3.213 0 0 1-1.178-.507 2.455 2.455 0 0 1-.761-.904c-.181-.37-.274-.893-.274-1.438 0-.523.104-.855.307-1.215.208-.36.487-.654.838-.883a3.609 3.609 0 0 1 1.227-.49 7.073 7.073 0 0 1 2.202-.103c.263.027.537.076.833.147v-.349c0-.245-.027-.479-.088-.697a1.486 1.486 0 0 0-.307-.583c-.148-.169-.34-.3-.581-.392a2.536 2.536 0 0 0-.915-.163c-.493 0-.942.06-1.353.131-.411.071-.75.153-1.008.245l-.257-1.749c.268-.093.668-.185 1.183-.278a9.335 9.335 0 0 1 1.66-.142l-.001-.001zm.181 7.731c.657 0 1.145-.038 1.484-.104v-2.168a5.097 5.097 0 0 0-1.978-.104c-.241.033-.46.098-.652.191a1.167 1.167 0 0 0-.466.392c-.121.169-.175.267-.175.523 0 .501.175.79.493.981.323.196.75.289 1.293.289h.001zM84.109 4.794c.707 0 1.304.087 1.786.262.482.174.871.42 1.156.73.29.316.487.735.608 1.182.126.447.186.937.186 1.476v5.481a25.24 25.24 0 0 1-1.495.251c-.668.098-1.419.147-2.251.147a6.829 6.829 0 0 1-1.517-.158 3.213 3.213 0 0 1-1.178-.507 2.455 2.455 0 0 1-.761-.904c-.181-.37-.274-.893-.274-1.438 0-.523.104-.855.307-1.215.208-.36.487-.654.838-.883a3.609 3.609 0 0 1 1.227-.49 7.073 7.073 0 0 1 2.202-.103c.257.027.537.076.833.147v-.349c0-.245-.027-.479-.088-.697a1.486 1.486 0 0 0-.307-.583c-.148-.169-.34-.3-.581-.392a2.536 2.536 0 0 0-.915-.163c-.493 0-.942.06-1.353.131-.411.071-.75.153-1.008.245l-.257-1.749c.268-.093.668-.185 1.183-.278a8.89 8.89 0 0 1 1.66-.142l-.001-.001zm.186 7.736c.657 0 1.145-.038 1.484-.104v-2.168a5.097 5.097 0 0 0-1.978-.104c-.241.033-.46.098-.652.191a1.167 1.167 0 0 0-.466.392c-.121.169-.175.267-.175.523 0 .501.175.79.493.981.318.191.75.289 1.293.289h.001zm8.682 1.738c-3.511.016-3.511-2.822-3.511-3.274L89.461.926l2.142-.338v10.003c0 .256 0 1.88 1.375 1.885v1.792h-.001z' fill='%23182359'/><path d='M5.027 11.025c0 .698-.252 1.246-.757 1.644-.505.397-1.201.596-2.089.596-.888 0-1.615-.138-2.181-.414v-1.214c.358.168.739.301 1.141.397.403.097.778.145 1.125.145.508 0 .884-.097 1.125-.29a.945.945 0 0 0 .363-.779.978.978 0 0 0-.333-.747c-.222-.204-.68-.446-1.375-.725-.716-.29-1.221-.621-1.515-.994-.294-.372-.44-.82-.44-1.343 0-.655.233-1.171.698-1.547.466-.376 1.09-.564 1.875-.564.752 0 1.5.165 2.245.494l-.408 1.047c-.698-.294-1.321-.44-1.869-.44-.415 0-.73.09-.945.271a.89.89 0 0 0-.322.717c0 .204.043.379.129.524.086.145.227.282.424.411.197.129.551.299 1.063.51.577.24.999.464 1.268.671.269.208.466.442.591.704.125.261.188.569.188.924l-.001.002zm3.98 2.24c-.924 0-1.646-.269-2.167-.808-.521-.539-.782-1.281-.782-2.226 0-.97.242-1.733.725-2.288.483-.555 1.148-.833 1.993-.833.784 0 1.404.238 1.858.714.455.476.682 1.132.682 1.966v.682H7.357c.018.577.174 1.02.467 1.329.294.31.707.465 1.241.465.351 0 .678-.033.98-.099a5.1 5.1 0 0 0 .975-.33v1.026a3.865 3.865 0 0 1-.935.312 5.723 5.723 0 0 1-1.08.091l.002-.001zm-.231-5.199c-.401 0-.722.127-.964.381s-.386.625-.432 1.112h2.696c-.007-.491-.125-.862-.354-1.115-.229-.252-.544-.379-.945-.379l-.001.001zm7.692 5.092l-.252-.827h-.043c-.286.362-.575.608-.865.739-.29.131-.662.196-1.117.196-.584 0-1.039-.158-1.367-.473-.328-.315-.491-.761-.491-1.337 0-.612.227-1.074.682-1.386.455-.312 1.148-.482 2.079-.51l1.026-.032v-.317c0-.38-.089-.663-.266-.851-.177-.188-.452-.282-.824-.282-.304 0-.596.045-.876.134a6.68 6.68 0 0 0-.806.317l-.408-.902a4.414 4.414 0 0 1 1.058-.384 4.856 4.856 0 0 1 1.085-.132c.756 0 1.326.165 1.711.494.385.329.577.847.577 1.552v4.002h-.902l-.001-.001zm-1.88-.859c.458 0 .826-.128 1.104-.384.278-.256.416-.615.416-1.077v-.516l-.763.032c-.594.021-1.027.121-1.297.298s-.406.448-.406.814c0 .265.079.47.236.615.158.145.394.218.709.218h.001zm7.557-5.189c.254 0 .464.018.628.054l-.124 1.176a2.383 2.383 0 0 0-.559-.064c-.505 0-.914.165-1.227.494-.313.329-.47.757-.47 1.284v3.105h-1.262V7.218h.988l.167 1.047h.064c.197-.354.454-.636.771-.843a1.83 1.83 0 0 1 1.023-.312h.001zm4.125 6.155c-.899 0-1.582-.262-2.049-.787-.467-.525-.701-1.277-.701-2.259 0-.999.244-1.767.733-2.304.489-.537 1.195-.806 2.119-.806.627 0 1.191.116 1.692.349l-.381 1.015c-.534-.208-.974-.312-1.321-.312-1.028 0-1.542.682-1.542 2.046 0 .666.128 1.166.384 1.501.256.335.631.502 1.125.502a3.23 3.23 0 0 0 1.595-.419v1.101a2.53 2.53 0 0 1-.722.285 4.356 4.356 0 0 1-.932.086v.002zm8.277-.107h-1.268V9.506c0-.458-.092-.8-.277-1.026-.184-.226-.477-.338-.878-.338-.53 0-.919.158-1.168.475-.249.317-.373.848-.373 1.593v2.949h-1.262V4.801h1.262v2.122c0 .34-.021.704-.064 1.09h.081a1.76 1.76 0 0 1 .717-.666c.306-.158.663-.236 1.072-.236 1.439 0 2.159.725 2.159 2.175v3.873l-.001-.001zm7.649-6.048c.741 0 1.319.269 1.732.806.414.537.62 1.291.62 2.261 0 .974-.209 1.732-.628 2.275-.419.542-1.001.814-1.746.814-.752 0-1.336-.27-1.751-.811h-.086l-.231.704h-.945V4.801h1.262v1.987l-.021.655-.032.553h.054c.401-.591.992-.886 1.772-.886zm-.328 1.031c-.508 0-.875.149-1.098.448-.224.299-.339.799-.346 1.501v.086c0 .723.115 1.247.344 1.571.229.324.603.486 1.123.486.448 0 .787-.177 1.018-.532.231-.354.346-.867.346-1.536 0-1.35-.462-2.025-1.386-2.025l-.001.001zm3.244-.924h1.375l1.209 3.368c.183.48.304.931.365 1.354h.043c.032-.197.091-.436.177-.717.086-.281.541-1.616 1.364-4.004h1.364l-2.541 6.73c-.462 1.235-1.232 1.853-2.31 1.853-.279 0-.551-.03-.816-.091v-.999c.19.043.406.064.65.064.609 0 1.037-.353 1.284-1.058l.22-.559-2.385-5.941h.001z' fill='%231D3657'/></g></svg>");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  overflow: hidden;
  text-indent: -9000px;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  display: block;
}

/*# sourceMappingURL=data:application/json;base64,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QUNmLGtCQUFrQjtFQUNsQix5QkFBaUI7VUFBakIsaUJBQWlCO0NBQ2xCOztBQUVEO0VBQ0UsYUFBYTtFQUNiLGFBQWE7RUFDYixjQUFjO0VBQ2QsdUJBQXVCO0VBQ3ZCLGFBQWE7RUFDYixhQUFhO0VBQ2IsZUFBZTtDQUNoQjs7QUFFRDtFQUNFLDQwUUFBNDBRO0VBQzUwUSw2QkFBNkI7RUFDN0IsNEJBQTRCO0VBQzVCLHNCQUFzQjtFQUN0QixpQkFBaUI7RUFDakIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixZQUFZO0VBQ1osYUFBYTtFQUNiLGVBQWU7Q0FDaEIiLCJmaWxlIjoiZG9jc2VhcmNoLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zZWFyY2hib3gge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDIwMHB4O1xuICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZSAhaW1wb3J0YW50O1xufVxuXG4uc2VhcmNoYm94IC5hbGdvbGlhLWF1dG9jb21wbGV0ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4uc2VhcmNoYm94X193cmFwcGVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgei1pbmRleDogOTk5O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5zZWFyY2hib3hfX2lucHV0IHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB0cmFuc2l0aW9uOiBib3gtc2hhZG93IC40cyBlYXNlLCBiYWNrZ3JvdW5kIC40cyBlYXNlO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDFweCAjQ0NDQ0NDO1xuICBiYWNrZ3JvdW5kOiAjRkZGRkZGICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDA7XG4gIHBhZGRpbmctcmlnaHQ6IDI2cHg7XG4gIHBhZGRpbmctbGVmdDogMzJweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBhcHBlYXJhbmNlOiBub25lO1xufVxuXG4uc2VhcmNoYm94X19pbnB1dDo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiwgLnNlYXJjaGJveF9faW5wdXQ6Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24sIC5zZWFyY2hib3hfX2lucHV0Ojotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWJ1dHRvbiwgLnNlYXJjaGJveF9faW5wdXQ6Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtZGVjb3JhdGlvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5zZWFyY2hib3hfX2lucHV0OmhvdmVyIHtcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMXB4ICNiM2IzYjM7XG59XG5cbi5zZWFyY2hib3hfX2lucHV0OmZvY3VzLCAuc2VhcmNoYm94X19pbnB1dDphY3RpdmUge1xuICBvdXRsaW5lOiAwO1xuICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAxcHggI0FBQUFBQTtcbiAgYmFja2dyb3VuZDogI0ZGRkZGRjtcbn1cblxuLnNlYXJjaGJveF9faW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICNBQUFBQUE7XG59XG5cbi5zZWFyY2hib3hfX3N1Ym1pdCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBtYXJnaW46IDA7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLXJhZGl1czogMTZweCAwIDAgMTZweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg2OSwgMTQyLCAyMjUsIDApO1xuICBwYWRkaW5nOiAwO1xuICB3aWR0aDogMzJweDtcbiAgaGVpZ2h0OiAxMDAlO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHJpZ2h0OiBpbmhlcml0O1xuICBsZWZ0OiAwO1xufVxuXG4uc2VhcmNoYm94X19zdWJtaXQ6OmJlZm9yZSB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luLXJpZ2h0OiAtNHB4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGNvbnRlbnQ6ICcnO1xufVxuXG4uc2VhcmNoYm94X19zdWJtaXQ6aG92ZXIsIC5zZWFyY2hib3hfX3N1Ym1pdDphY3RpdmUge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5zZWFyY2hib3hfX3N1Ym1pdDpmb2N1cyB7XG4gIG91dGxpbmU6IDA7XG59XG5cbi5zZWFyY2hib3hfX3N1Ym1pdCBzdmcge1xuICB3aWR0aDogMTRweDtcbiAgaGVpZ2h0OiAxNHB4O1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBmaWxsOiAjNkQ3RTk2O1xufVxuXG4uc2VhcmNoYm94X19yZXNldCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogOHB4O1xuICByaWdodDogOHB4O1xuICBtYXJnaW46IDA7XG4gIGJvcmRlcjogMDtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAwO1xuICBmb250LXNpemU6IGluaGVyaXQ7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBmaWxsOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG59XG5cbi5zZWFyY2hib3hfX3Jlc2V0LmhpZGUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4uc2VhcmNoYm94X19yZXNldDpmb2N1cyB7XG4gIG91dGxpbmU6IDA7XG59XG5cbi5zZWFyY2hib3hfX3Jlc2V0IHN2ZyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXJnaW46IDRweDtcbiAgd2lkdGg6IDhweDtcbiAgaGVpZ2h0OiA4cHg7XG59XG5cbi5zZWFyY2hib3hfX2lucHV0OnZhbGlkIH4gLnNlYXJjaGJveF9fcmVzZXQge1xuICBkaXNwbGF5OiBibG9jaztcbiAgYW5pbWF0aW9uLW5hbWU6IHNieC1yZXNldC1pbjtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAuMTVzO1xufVxuXG5Aa2V5ZnJhbWVzIHNieC1yZXNldC1pbiB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKC0yMCUsIDAsIDApO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBub25lO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlLmFsZ29saWEtYXV0b2NvbXBsZXRlLXJpZ2h0IC5kcy1kcm9wZG93bi1tZW51IHtcbiAgcmlnaHQ6IDAgIWltcG9ydGFudDtcbiAgbGVmdDogaW5oZXJpdCAhaW1wb3J0YW50O1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUuYWxnb2xpYS1hdXRvY29tcGxldGUtcmlnaHQgLmRzLWRyb3Bkb3duLW1lbnU6YmVmb3JlIHtcbiAgcmlnaHQ6IDQ4cHg7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZS5hbGdvbGlhLWF1dG9jb21wbGV0ZS1sZWZ0IC5kcy1kcm9wZG93bi1tZW51IHtcbiAgbGVmdDogMCAhaW1wb3J0YW50O1xuICByaWdodDogaW5oZXJpdCAhaW1wb3J0YW50O1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUuYWxnb2xpYS1hdXRvY29tcGxldGUtbGVmdCAuZHMtZHJvcGRvd24tbWVudTpiZWZvcmUge1xuICBsZWZ0OiA0OHB4O1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmRzLWRyb3Bkb3duLW1lbnUge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRvcDogLTZweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBtYXJnaW46IDZweCAwIDA7XG4gIHBhZGRpbmc6IDA7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGhlaWdodDogYXV0bztcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyOiBub25lO1xuICB6LWluZGV4OiA5OTk7XG4gIG1heC13aWR0aDogNjAwcHg7XG4gIG1pbi13aWR0aDogNTAwcHg7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDAgMCByZ2JhKDAsIDAsIDAsIDAuMiksIDAgMnB4IDNweCAwIHJnYmEoMCwgMCwgMCwgMC4xKTtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5kcy1kcm9wZG93bi1tZW51OmJlZm9yZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGNvbnRlbnQ6ICcnO1xuICB3aWR0aDogMTRweDtcbiAgaGVpZ2h0OiAxNHB4O1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICB6LWluZGV4OiAxMDAwO1xuICB0b3A6IC03cHg7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZDlkOWQ5O1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZDlkOWQ5O1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgtNDVkZWcpO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuZHMtZHJvcGRvd24tbWVudSAuZHMtc3VnZ2VzdGlvbnMge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDEwMDA7XG4gIG1hcmdpbi10b3A6IDhweDtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5kcy1kcm9wZG93bi1tZW51IC5kcy1zdWdnZXN0aW9uIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmRzLWRyb3Bkb3duLW1lbnUgLmRzLXN1Z2dlc3Rpb24uZHMtY3Vyc29yIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNjksIDE0MiwgMjI1LCAwLjA1KTtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5kcy1kcm9wZG93bi1tZW51IC5kcy1zdWdnZXN0aW9uLmRzLWN1cnNvciAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbjpub3QoLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSkgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLWNvbnRlbnQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDY5LCAxNDIsIDIyNSwgMC4wNSk7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuZHMtZHJvcGRvd24tbWVudSBbY2xhc3NePVwiZHMtZGF0YXNldC1cIl0ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJvcmRlcjogc29saWQgMXB4ICNkOWQ5ZDk7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgb3ZlcmZsb3c6IGF1dG87XG4gIHBhZGRpbmc6IDAgOHB4IDhweDtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5kcy1kcm9wZG93bi1tZW51ICoge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmc6IDAgOHB4O1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBjb2xvcjogIzAyMDYwQztcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1oaWdobGlnaHQge1xuICBjb2xvcjogIzE3NGQ4YztcbiAgYmFja2dyb3VuZDogcmdiYSgxNDMsIDE4NywgMjM3LCAwLjEpO1xuICBwYWRkaW5nOiAwLjFlbSAwLjA1ZW07XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tY2F0ZWdvcnktaGVhZGVyIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1jYXRlZ29yeS1oZWFkZXItbHZsMCAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0taGlnaGxpZ2h0LFxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1jYXRlZ29yeS1oZWFkZXIgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLWNhdGVnb3J5LWhlYWRlci1sdmwxIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1oaWdobGlnaHQge1xuICBjb2xvcjogaW5oZXJpdDtcbiAgYmFja2dyb3VuZDogaW5oZXJpdDtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS10ZXh0IC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1oaWdobGlnaHQge1xuICBwYWRkaW5nOiAwIDAgMXB4O1xuICBiYWNrZ3JvdW5kOiBpbmhlcml0O1xuICBib3gtc2hhZG93OiBpbnNldCAwIC0ycHggMCAwIHJnYmEoNjksIDE0MiwgMjI1LCAwLjgpO1xuICBjb2xvcjogaW5oZXJpdDtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1jb250ZW50IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZsb2F0OiByaWdodDtcbiAgd2lkdGg6IDcwJTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nOiA1LjMzMzMzcHggMCA1LjMzMzMzcHggMTAuNjY2NjdweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLWNvbnRlbnQ6YmVmb3JlIHtcbiAgY29udGVudDogJyc7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHRvcDogMDtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMXB4O1xuICBiYWNrZ3JvdW5kOiAjZGRkO1xuICBsZWZ0OiAtMXB4O1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLWNhdGVnb3J5LWhlYWRlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIG1hcmdpbi10b3A6IDhweDtcbiAgcGFkZGluZzogNHB4IDA7XG4gIGZvbnQtc2l6ZTogMWVtO1xuICBjb2xvcjogIzMzMzYzRDtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS13cmFwcGVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGZsb2F0OiBsZWZ0O1xuICBwYWRkaW5nOiA4cHggMCAwIDA7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tc3ViY2F0ZWdvcnktY29sdW1uIHtcbiAgZmxvYXQ6IGxlZnQ7XG4gIHdpZHRoOiAzMCU7XG4gIHBhZGRpbmctbGVmdDogMDtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzogNS4zMzMzM3B4IDEwLjY2NjY3cHg7XG4gIGNvbG9yOiAjQTRBN0FFO1xuICBmb250LXNpemU6IDAuOWVtO1xuICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tc3ViY2F0ZWdvcnktY29sdW1uOmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICcnO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB0b3A6IDA7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDFweDtcbiAgYmFja2dyb3VuZDogI2RkZDtcbiAgcmlnaHQ6IDA7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tc3ViY2F0ZWdvcnktY29sdW1uIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1oaWdobGlnaHQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBpbmhlcml0O1xuICBjb2xvcjogaW5oZXJpdDtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1zdWJjYXRlZ29yeS1pbmxpbmUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLXRpdGxlIHtcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xuICBjb2xvcjogIzAyMDYwQztcbiAgZm9udC1zaXplOiAwLjllbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tdGV4dCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBsaW5lLWhlaWdodDogMS4yZW07XG4gIGZvbnQtc2l6ZTogMC44NWVtO1xuICBjb2xvcjogIzYzNjc2RDtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1uby1yZXN1bHRzIHtcbiAgd2lkdGg6IDEwMCU7XG4gIHBhZGRpbmc6IDhweCAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMS4yZW07XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tbm8tcmVzdWx0czo6YmVmb3JlIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uIGNvZGUge1xuICBwYWRkaW5nOiAxcHggNXB4O1xuICBmb250LXNpemU6IDkwJTtcbiAgYm9yZGVyOiBub25lO1xuICBjb2xvcjogIzIyMjIyMjtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0VCRUJFQjtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBmb250LWZhbWlseTogTWVubG8sTW9uYWNvLENvbnNvbGFzLFwiQ291cmllciBOZXdcIixtb25vc3BhY2U7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbiBjb2RlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1oaWdobGlnaHQge1xuICBiYWNrZ3JvdW5kOiBub25lO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24uYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbl9fbWFpbiAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tY2F0ZWdvcnktaGVhZGVyIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uX19zZWNvbmRhcnkge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuQG1lZGlhIGFsbCBhbmQgKG1pbi13aWR0aDogNzY4cHgpIHtcbiAgLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1zdWJjYXRlZ29yeS1jb2x1bW4ge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICB9XG59XG5cbkBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbiAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tc3ViY2F0ZWdvcnktY29sdW1uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgd2lkdGg6IGF1dG87XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBmbG9hdDogbGVmdDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGNvbG9yOiAjMDIwNjBDO1xuICAgIGZvbnQtc2l6ZTogMC45ZW07XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgfVxuICAuYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24gLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLXN1YmNhdGVnb3J5LWNvbHVtbjpiZWZvcmUge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1zdWJjYXRlZ29yeS1jb2x1bW46YWZ0ZXIge1xuICAgIGNvbnRlbnQ6IFwifFwiO1xuICB9XG4gIC5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbiAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tY29udGVudCB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHdpZHRoOiBhdXRvO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgZmxvYXQ6IGxlZnQ7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuICAuYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24gLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLWNvbnRlbnQ6YmVmb3JlIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuc3VnZ2VzdGlvbi1sYXlvdXQtc2ltcGxlLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24ge1xuICBib3JkZXItYm90dG9tOiBzb2xpZCAxcHggI2VlZTtcbiAgcGFkZGluZzogOHB4O1xuICBtYXJnaW46IDA7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuc3VnZ2VzdGlvbi1sYXlvdXQtc2ltcGxlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1jb250ZW50IHtcbiAgd2lkdGg6IDEwMCU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuc3VnZ2VzdGlvbi1sYXlvdXQtc2ltcGxlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1jb250ZW50OjpiZWZvcmUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tY2F0ZWdvcnktaGVhZGVyIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuLmFsZ29saWEtYXV0b2NvbXBsZXRlIC5zdWdnZXN0aW9uLWxheW91dC1zaW1wbGUgLmFsZ29saWEtZG9jc2VhcmNoLXN1Z2dlc3Rpb24tLWNhdGVnb3J5LWhlYWRlci1sdmwwIHtcbiAgb3BhY2l0eTogLjY7XG4gIGZvbnQtc2l6ZTogMC44NWVtO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tY2F0ZWdvcnktaGVhZGVyLWx2bDEge1xuICBvcGFjaXR5OiAuNjtcbiAgZm9udC1zaXplOiAwLjg1ZW07XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuc3VnZ2VzdGlvbi1sYXlvdXQtc2ltcGxlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1jYXRlZ29yeS1oZWFkZXItbHZsMTo6YmVmb3JlIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIxMFwiIHZpZXdCb3g9XCIwIDAgMjAgMzhcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0xLjQ5IDQuMzFsMTQgMTYuMTI2LjAwMi0yLjYyNC0xNCAxNi4wNzQtMS4zMTQgMS41MSAzLjAxNyAyLjYyNiAxLjMxMy0xLjUwOCAxNC0xNi4wNzUgMS4xNDItMS4zMTMtMS4xNC0xLjMxMy0xNC0xNi4xMjVMMy4yLjE4LjE4IDIuOGwxLjMxIDEuNTF6XCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGZpbGw9XCIlMjMxRDM2NTdcIiAvPjwvc3ZnPicpO1xuICBjb250ZW50OiAnJztcbiAgd2lkdGg6IDEwcHg7XG4gIGhlaWdodDogMTBweDtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0td3JhcHBlciB7XG4gIHdpZHRoOiAxMDAlO1xuICBmbG9hdDogbGVmdDtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tZHVwbGljYXRlLWNvbnRlbnQsIC5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuc3VnZ2VzdGlvbi1sYXlvdXQtc2ltcGxlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS1zdWJjYXRlZ29yeS1pbmxpbmUge1xuICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuc3VnZ2VzdGlvbi1sYXlvdXQtc2ltcGxlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS10aXRsZSB7XG4gIG1hcmdpbjogMDtcbiAgY29sb3I6ICM0NThFRTE7XG4gIGZvbnQtc2l6ZTogMC45ZW07XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuc3VnZ2VzdGlvbi1sYXlvdXQtc2ltcGxlIC5hbGdvbGlhLWRvY3NlYXJjaC1zdWdnZXN0aW9uLS10aXRsZTo6YmVmb3JlIHtcbiAgY29udGVudDogXCIjXCI7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogIzQ1OEVFMTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tdGV4dCB7XG4gIG1hcmdpbjogNHB4IDAgMDtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGxpbmUtaGVpZ2h0OiAxLjRlbTtcbiAgcGFkZGluZzogNS4zMzMzM3B4IDhweDtcbiAgYmFja2dyb3VuZDogI2Y4ZjhmODtcbiAgZm9udC1zaXplOiAwLjg1ZW07XG4gIG9wYWNpdHk6IC44O1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLnN1Z2dlc3Rpb24tbGF5b3V0LXNpbXBsZSAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0tdGV4dCAuYWxnb2xpYS1kb2NzZWFyY2gtc3VnZ2VzdGlvbi0taGlnaGxpZ2h0IHtcbiAgY29sb3I6ICMzZjQxNDU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBib3gtc2hhZG93OiBub25lO1xufVxuXG4uYWxnb2xpYS1hdXRvY29tcGxldGUgLmFsZ29saWEtZG9jc2VhcmNoLWZvb3RlciB7XG4gIHdpZHRoOiAxMTBweDtcbiAgaGVpZ2h0OiAyMHB4O1xuICB6LWluZGV4OiAyMDAwO1xuICBtYXJnaW4tdG9wOiAxMC42NjY2N3B4O1xuICBmbG9hdDogcmlnaHQ7XG4gIGZvbnQtc2l6ZTogMDtcbiAgbGluZS1oZWlnaHQ6IDA7XG59XG5cbi5hbGdvbGlhLWF1dG9jb21wbGV0ZSAuYWxnb2xpYS1kb2NzZWFyY2gtZm9vdGVyLS1sb2dvIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB2aWV3Qm94PScwIDAgMTMwIDE4JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0nLTM2Ljg2OCUnIHkxPScxMzQuOTM2JScgeDI9JzEyOS40MzIlJyB5Mj0nLTI3LjclJyBpZD0nYSc+PHN0b3Agc3RvcC1jb2xvcj0nJTIzMDBBRUZGJyBvZmZzZXQ9JzAlJy8+PHN0b3Agc3RvcC1jb2xvcj0nJTIzMzM2OUU3JyBvZmZzZXQ9JzEwMCUnLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPjxwYXRoIGQ9J001OS4zOTkuMDIyaDEzLjI5OWEyLjM3MiAyLjM3MiAwIDAgMSAyLjM3NyAyLjM2NFYxNS42MmEyLjM3MiAyLjM3MiAwIDAgMS0yLjM3NyAyLjM2NEg1OS4zOTlhMi4zNzIgMi4zNzIgMCAwIDEtMi4zNzctMi4zNjRWMi4zODFBMi4zNjggMi4zNjggMCAwIDEgNTkuMzk5LjAyMnonIGZpbGw9J3VybCglMjNhKScvPjxwYXRoIGQ9J002Ni4yNTcgNC41NmMtMi44MTUgMC01LjEgMi4yNzItNS4xIDUuMDc4IDAgMi44MDYgMi4yODQgNS4wNzIgNS4xIDUuMDcyIDIuODE1IDAgNS4xLTIuMjcyIDUuMS01LjA3OCAwLTIuODA2LTIuMjc5LTUuMDcyLTUuMS01LjA3MnptMCA4LjY1MmMtMS45ODMgMC0zLjU5My0xLjYwMi0zLjU5My0zLjU3NCAwLTEuOTcyIDEuNjEtMy41NzQgMy41OTMtMy41NzQgMS45ODMgMCAzLjU5MyAxLjYwMiAzLjU5MyAzLjU3NGEzLjU4MiAzLjU4MiAwIDAgMS0zLjU5MyAzLjU3NHptMC02LjQxOHYyLjY2NGMwIC4wNzYuMDgyLjEzMS4xNTMuMDkzbDIuMzc3LTEuMjI2Yy4wNTUtLjAyNy4wNzEtLjA5My4wNDQtLjE0N2EyLjk2IDIuOTYgMCAwIDAtMi40NjUtMS40ODdjLS4wNTUgMC0uMTEuMDQ0LS4xMS4xMDRsLjAwMS0uMDAxem0tMy4zMy0xLjk1NmwtLjMxMi0uMzExYS43ODMuNzgzIDAgMCAwLTEuMTA2IDBsLS4zNzIuMzdhLjc3My43NzMgMCAwIDAgMCAxLjEwMWwuMzA3LjMwNWMuMDQ5LjA0OS4xMjEuMDM4LjE2NC0uMDExLjE4MS0uMjQ1LjM3OC0uNDc5LjU5Ny0uNjk3LjIyNS0uMjIzLjQ1NS0uNDIuNzA3LS41OTkuMDU1LS4wMzMuMDYtLjEwOS4wMTYtLjE1OGgtLjAwMXptNS4wMDEtLjgwNnYtLjYxNmEuNzgxLjc4MSAwIDAgMC0uNzgzLS43NzloLTEuODI0YS43OC43OCAwIDAgMC0uNzgzLjc3OXYuNjMyYzAgLjA3MS4wNjYuMTIuMTM3LjEwNGE1LjczNiA1LjczNiAwIDAgMSAxLjU4OC0uMjIzYy41MiAwIDEuMDM1LjA3MSAxLjUzNC4yMDdhLjEwNi4xMDYgMCAwIDAgLjEzMS0uMTA0eicgZmlsbD0nJTIzRkZGJy8+PHBhdGggZD0nTTEwMi4xNjIgMTMuNzYyYzAgMS40NTUtLjM3MiAyLjUxNy0xLjEyMyAzLjE5My0uNzUuNjc2LTEuODk1IDEuMDEzLTMuNDQgMS4wMTMtLjU2NCAwLTEuNzM2LS4xMDktMi42NzMtLjMxNmwuMzQ1LTEuNjg5Yy43ODMuMTYzIDEuODE5LjIwNyAyLjM2MS4yMDcuODYgMCAxLjQ3My0uMTc0IDEuODQtLjUyMy4zNjctLjM0OS41NDgtLjg2Ni41NDgtMS41NTN2LS4zNDlhNi4zNzQgNi4zNzQgMCAwIDEtLjgzOC4zMTYgNC4xNTEgNC4xNTEgMCAwIDEtMS4xOTQuMTU4IDQuNTE1IDQuNTE1IDAgMCAxLTEuNjE2LS4yNzggMy4zODUgMy4zODUgMCAwIDEtMS4yNTQtLjgxNyAzLjc0NCAzLjc0NCAwIDAgMS0uODExLTEuMzUxYy0uMTkyLS41MzktLjI5LTEuNTA0LS4yOS0yLjIxMiAwLS42NjUuMTA0LTEuNDk4LjMwNy0yLjA1NGEzLjkyNSAzLjkyNSAwIDAgMSAuOTA0LTEuNDMzIDQuMTI0IDQuMTI0IDAgMCAxIDEuNDQxLS45MjYgNS4zMSA1LjMxIDAgMCAxIDEuOTQ1LS4zNjVjLjY5NiAwIDEuMzM3LjA4NyAxLjk2MS4xOTFhMTUuODYgMTUuODYgMCAwIDEgMS41ODguMzMydjguNDU2aC0uMDAxem0tNS45NTQtNC4yMDZjMCAuODkzLjE5NyAxLjg4NS41OTIgMi4yOTkuMzk0LjQxNC45MDQuNjIxIDEuNTI4LjYyMS4zNCAwIC42NjMtLjA0OS45NjQtLjE0MmEyLjc1IDIuNzUgMCAwIDAgLjczNC0uMzMydi01LjI5YTguNTMxIDguNTMxIDAgMCAwLTEuNDEzLS4xOGMtLjc3OC0uMDIyLTEuMzY5LjI5NC0xLjc4Ni44MDEtLjQxMS41MDctLjYxOSAxLjM5NS0uNjE5IDIuMjIzem0xNi4xMiAwYzAgLjcxOS0uMTA0IDEuMjY0LS4zMTggMS44NThhNC4zODkgNC4zODkgMCAwIDEtLjkwNCAxLjUyYy0uMzg5LjQyLS44NTQuNzQ2LTEuNDAyLjk3NS0uNTQ4LjIyOS0xLjM5MS4zNi0xLjgxMy4zNi0uNDIyLS4wMDUtMS4yNi0uMTI1LTEuODAyLS4zNmE0LjA4OCA0LjA4OCAwIDAgMS0xLjM5Ny0uOTc1IDQuNDg2IDQuNDg2IDAgMCAxLS45MDktMS41MiA1LjAzNyA1LjAzNyAwIDAgMS0uMzI5LTEuODU4YzAtLjcxOS4wOTktMS40MTEuMzE4LTEuOTk5LjIxOS0uNTg4LjUyNi0xLjA5LjkyLTEuNTA5LjM5NC0uNDIuODY1LS43NDEgMS40MDItLjk3YTQuNTQ3IDQuNTQ3IDAgMCAxIDEuNzg2LS4zMzggNC42OSA0LjY5IDAgMCAxIDEuNzkxLjMzOGMuNTQ4LjIyOSAxLjAxOS41NSAxLjQwMi45Ny4zODkuNDIuNjkuOTIxLjkwOSAxLjUwOS4yMy41ODguMzQ1IDEuMjguMzQ1IDEuOTk5aC4wMDF6bS0yLjE5MS4wMDVjMC0uOTIxLS4yMDMtMS42ODktLjU5Ny0yLjIyMy0uMzk0LS41MzktLjk0OC0uODA2LTEuNjU0LS44MDYtLjcwNyAwLTEuMjYuMjY3LTEuNjU0LjgwNi0uMzk0LjUzOS0uNTg2IDEuMzAyLS41ODYgMi4yMjMgMCAuOTMyLjE5NyAxLjU1OC41OTIgMi4wOTguMzk0LjU0NS45NDguODEyIDEuNjU0LjgxMi43MDcgMCAxLjI2LS4yNzIgMS42NTQtLjgxMi4zOTQtLjU0NS41OTItMS4xNjYuNTkyLTIuMDk4aC0uMDAxem02Ljk2MiA0LjcwN2MtMy41MTEuMDE2LTMuNTExLTIuODIyLTMuNTExLTMuMjc0TDExMy41ODMuOTI2bDIuMTQyLS4zMzh2MTAuMDAzYzAgLjI1NiAwIDEuODggMS4zNzUgMS44ODV2MS43OTJoLS4wMDF6bTMuNzc0IDBoLTIuMTUzVjUuMDcybDIuMTUzLS4zMzh2OS41MzR6bS0xLjA3OS0xMC41NDJjLjcxOCAwIDEuMzA0LS41NzggMS4zMDQtMS4yOTEgMC0uNzE0LS41ODEtMS4yOTEtMS4zMDQtMS4yOTEtLjcyMyAwLTEuMzA0LjU3OC0xLjMwNCAxLjI5MSAwIC43MTQuNTg2IDEuMjkxIDEuMzA0IDEuMjkxem02LjQzMSAxLjAxM2MuNzA3IDAgMS4zMDQuMDg3IDEuNzg2LjI2Mi40ODIuMTc0Ljg3MS40MiAxLjE1Ni43My4yODUuMzExLjQ4OC43MzUuNjA4IDEuMTgyLjEyNi40NDcuMTg2LjkzNy4xODYgMS40NzZ2NS40ODFhMjUuMjQgMjUuMjQgMCAwIDEtMS40OTUuMjUxYy0uNjY4LjA5OC0xLjQxOS4xNDctMi4yNTEuMTQ3YTYuODI5IDYuODI5IDAgMCAxLTEuNTE3LS4xNTggMy4yMTMgMy4yMTMgMCAwIDEtMS4xNzgtLjUwNyAyLjQ1NSAyLjQ1NSAwIDAgMS0uNzYxLS45MDRjLS4xODEtLjM3LS4yNzQtLjg5My0uMjc0LTEuNDM4IDAtLjUyMy4xMDQtLjg1NS4zMDctMS4yMTUuMjA4LS4zNi40ODctLjY1NC44MzgtLjg4M2EzLjYwOSAzLjYwOSAwIDAgMSAxLjIyNy0uNDkgNy4wNzMgNy4wNzMgMCAwIDEgMi4yMDItLjEwM2MuMjYzLjAyNy41MzcuMDc2LjgzMy4xNDd2LS4zNDljMC0uMjQ1LS4wMjctLjQ3OS0uMDg4LS42OTdhMS40ODYgMS40ODYgMCAwIDAtLjMwNy0uNTgzYy0uMTQ4LS4xNjktLjM0LS4zLS41ODEtLjM5MmEyLjUzNiAyLjUzNiAwIDAgMC0uOTE1LS4xNjNjLS40OTMgMC0uOTQyLjA2LTEuMzUzLjEzMS0uNDExLjA3MS0uNzUuMTUzLTEuMDA4LjI0NWwtLjI1Ny0xLjc0OWMuMjY4LS4wOTMuNjY4LS4xODUgMS4xODMtLjI3OGE5LjMzNSA5LjMzNSAwIDAgMSAxLjY2LS4xNDJsLS4wMDEtLjAwMXptLjE4MSA3LjczMWMuNjU3IDAgMS4xNDUtLjAzOCAxLjQ4NC0uMTA0di0yLjE2OGE1LjA5NyA1LjA5NyAwIDAgMC0xLjk3OC0uMTA0Yy0uMjQxLjAzMy0uNDYuMDk4LS42NTIuMTkxYTEuMTY3IDEuMTY3IDAgMCAwLS40NjYuMzkyYy0uMTIxLjE2OS0uMTc1LjI2Ny0uMTc1LjUyMyAwIC41MDEuMTc1Ljc5LjQ5My45ODEuMzIzLjE5Ni43NS4yODkgMS4yOTMuMjg5aC4wMDF6TTg0LjEwOSA0Ljc5NGMuNzA3IDAgMS4zMDQuMDg3IDEuNzg2LjI2Mi40ODIuMTc0Ljg3MS40MiAxLjE1Ni43My4yOS4zMTYuNDg3LjczNS42MDggMS4xODIuMTI2LjQ0Ny4xODYuOTM3LjE4NiAxLjQ3NnY1LjQ4MWEyNS4yNCAyNS4yNCAwIDAgMS0xLjQ5NS4yNTFjLS42NjguMDk4LTEuNDE5LjE0Ny0yLjI1MS4xNDdhNi44MjkgNi44MjkgMCAwIDEtMS41MTctLjE1OCAzLjIxMyAzLjIxMyAwIDAgMS0xLjE3OC0uNTA3IDIuNDU1IDIuNDU1IDAgMCAxLS43NjEtLjkwNGMtLjE4MS0uMzctLjI3NC0uODkzLS4yNzQtMS40MzggMC0uNTIzLjEwNC0uODU1LjMwNy0xLjIxNS4yMDgtLjM2LjQ4Ny0uNjU0LjgzOC0uODgzYTMuNjA5IDMuNjA5IDAgMCAxIDEuMjI3LS40OSA3LjA3MyA3LjA3MyAwIDAgMSAyLjIwMi0uMTAzYy4yNTcuMDI3LjUzNy4wNzYuODMzLjE0N3YtLjM0OWMwLS4yNDUtLjAyNy0uNDc5LS4wODgtLjY5N2ExLjQ4NiAxLjQ4NiAwIDAgMC0uMzA3LS41ODNjLS4xNDgtLjE2OS0uMzQtLjMtLjU4MS0uMzkyYTIuNTM2IDIuNTM2IDAgMCAwLS45MTUtLjE2M2MtLjQ5MyAwLS45NDIuMDYtMS4zNTMuMTMxLS40MTEuMDcxLS43NS4xNTMtMS4wMDguMjQ1bC0uMjU3LTEuNzQ5Yy4yNjgtLjA5My42NjgtLjE4NSAxLjE4My0uMjc4YTguODkgOC44OSAwIDAgMSAxLjY2LS4xNDJsLS4wMDEtLjAwMXptLjE4NiA3LjczNmMuNjU3IDAgMS4xNDUtLjAzOCAxLjQ4NC0uMTA0di0yLjE2OGE1LjA5NyA1LjA5NyAwIDAgMC0xLjk3OC0uMTA0Yy0uMjQxLjAzMy0uNDYuMDk4LS42NTIuMTkxYTEuMTY3IDEuMTY3IDAgMCAwLS40NjYuMzkyYy0uMTIxLjE2OS0uMTc1LjI2Ny0uMTc1LjUyMyAwIC41MDEuMTc1Ljc5LjQ5My45ODEuMzE4LjE5MS43NS4yODkgMS4yOTMuMjg5aC4wMDF6bTguNjgyIDEuNzM4Yy0zLjUxMS4wMTYtMy41MTEtMi44MjItMy41MTEtMy4yNzRMODkuNDYxLjkyNmwyLjE0Mi0uMzM4djEwLjAwM2MwIC4yNTYgMCAxLjg4IDEuMzc1IDEuODg1djEuNzkyaC0uMDAxeicgZmlsbD0nJTIzMTgyMzU5Jy8+PHBhdGggZD0nTTUuMDI3IDExLjAyNWMwIC42OTgtLjI1MiAxLjI0Ni0uNzU3IDEuNjQ0LS41MDUuMzk3LTEuMjAxLjU5Ni0yLjA4OS41OTYtLjg4OCAwLTEuNjE1LS4xMzgtMi4xODEtLjQxNHYtMS4yMTRjLjM1OC4xNjguNzM5LjMwMSAxLjE0MS4zOTcuNDAzLjA5Ny43NzguMTQ1IDEuMTI1LjE0NS41MDggMCAuODg0LS4wOTcgMS4xMjUtLjI5YS45NDUuOTQ1IDAgMCAwIC4zNjMtLjc3OS45NzguOTc4IDAgMCAwLS4zMzMtLjc0N2MtLjIyMi0uMjA0LS42OC0uNDQ2LTEuMzc1LS43MjUtLjcxNi0uMjktMS4yMjEtLjYyMS0xLjUxNS0uOTk0LS4yOTQtLjM3Mi0uNDQtLjgyLS40NC0xLjM0MyAwLS42NTUuMjMzLTEuMTcxLjY5OC0xLjU0Ny40NjYtLjM3NiAxLjA5LS41NjQgMS44NzUtLjU2NC43NTIgMCAxLjUuMTY1IDIuMjQ1LjQ5NGwtLjQwOCAxLjA0N2MtLjY5OC0uMjk0LTEuMzIxLS40NC0xLjg2OS0uNDQtLjQxNSAwLS43My4wOS0uOTQ1LjI3MWEuODkuODkgMCAwIDAtLjMyMi43MTdjMCAuMjA0LjA0My4zNzkuMTI5LjUyNC4wODYuMTQ1LjIyNy4yODIuNDI0LjQxMS4xOTcuMTI5LjU1MS4yOTkgMS4wNjMuNTEuNTc3LjI0Ljk5OS40NjQgMS4yNjguNjcxLjI2OS4yMDguNDY2LjQ0Mi41OTEuNzA0LjEyNS4yNjEuMTg4LjU2OS4xODguOTI0bC0uMDAxLjAwMnptMy45OCAyLjI0Yy0uOTI0IDAtMS42NDYtLjI2OS0yLjE2Ny0uODA4LS41MjEtLjUzOS0uNzgyLTEuMjgxLS43ODItMi4yMjYgMC0uOTcuMjQyLTEuNzMzLjcyNS0yLjI4OC40ODMtLjU1NSAxLjE0OC0uODMzIDEuOTkzLS44MzMuNzg0IDAgMS40MDQuMjM4IDEuODU4LjcxNC40NTUuNDc2LjY4MiAxLjEzMi42ODIgMS45NjZ2LjY4Mkg3LjM1N2MuMDE4LjU3Ny4xNzQgMS4wMi40NjcgMS4zMjkuMjk0LjMxLjcwNy40NjUgMS4yNDEuNDY1LjM1MSAwIC42NzgtLjAzMy45OC0uMDk5YTUuMSA1LjEgMCAwIDAgLjk3NS0uMzN2MS4wMjZhMy44NjUgMy44NjUgMCAwIDEtLjkzNS4zMTIgNS43MjMgNS43MjMgMCAwIDEtMS4wOC4wOTFsLjAwMi0uMDAxem0tLjIzMS01LjE5OWMtLjQwMSAwLS43MjIuMTI3LS45NjQuMzgxcy0uMzg2LjYyNS0uNDMyIDEuMTEyaDIuNjk2Yy0uMDA3LS40OTEtLjEyNS0uODYyLS4zNTQtMS4xMTUtLjIyOS0uMjUyLS41NDQtLjM3OS0uOTQ1LS4zNzlsLS4wMDEuMDAxem03LjY5MiA1LjA5MmwtLjI1Mi0uODI3aC0uMDQzYy0uMjg2LjM2Mi0uNTc1LjYwOC0uODY1LjczOS0uMjkuMTMxLS42NjIuMTk2LTEuMTE3LjE5Ni0uNTg0IDAtMS4wMzktLjE1OC0xLjM2Ny0uNDczLS4zMjgtLjMxNS0uNDkxLS43NjEtLjQ5MS0xLjMzNyAwLS42MTIuMjI3LTEuMDc0LjY4Mi0xLjM4Ni40NTUtLjMxMiAxLjE0OC0uNDgyIDIuMDc5LS41MWwxLjAyNi0uMDMydi0uMzE3YzAtLjM4LS4wODktLjY2My0uMjY2LS44NTEtLjE3Ny0uMTg4LS40NTItLjI4Mi0uODI0LS4yODItLjMwNCAwLS41OTYuMDQ1LS44NzYuMTM0YTYuNjggNi42OCAwIDAgMC0uODA2LjMxN2wtLjQwOC0uOTAyYTQuNDE0IDQuNDE0IDAgMCAxIDEuMDU4LS4zODQgNC44NTYgNC44NTYgMCAwIDEgMS4wODUtLjEzMmMuNzU2IDAgMS4zMjYuMTY1IDEuNzExLjQ5NC4zODUuMzI5LjU3Ny44NDcuNTc3IDEuNTUydjQuMDAyaC0uOTAybC0uMDAxLS4wMDF6bS0xLjg4LS44NTljLjQ1OCAwIC44MjYtLjEyOCAxLjEwNC0uMzg0LjI3OC0uMjU2LjQxNi0uNjE1LjQxNi0xLjA3N3YtLjUxNmwtLjc2My4wMzJjLS41OTQuMDIxLTEuMDI3LjEyMS0xLjI5Ny4yOThzLS40MDYuNDQ4LS40MDYuODE0YzAgLjI2NS4wNzkuNDcuMjM2LjYxNS4xNTguMTQ1LjM5NC4yMTguNzA5LjIxOGguMDAxem03LjU1Ny01LjE4OWMuMjU0IDAgLjQ2NC4wMTguNjI4LjA1NGwtLjEyNCAxLjE3NmEyLjM4MyAyLjM4MyAwIDAgMC0uNTU5LS4wNjRjLS41MDUgMC0uOTE0LjE2NS0xLjIyNy40OTQtLjMxMy4zMjktLjQ3Ljc1Ny0uNDcgMS4yODR2My4xMDVoLTEuMjYyVjcuMjE4aC45ODhsLjE2NyAxLjA0N2guMDY0Yy4xOTctLjM1NC40NTQtLjYzNi43NzEtLjg0M2ExLjgzIDEuODMgMCAwIDEgMS4wMjMtLjMxMmguMDAxem00LjEyNSA2LjE1NWMtLjg5OSAwLTEuNTgyLS4yNjItMi4wNDktLjc4Ny0uNDY3LS41MjUtLjcwMS0xLjI3Ny0uNzAxLTIuMjU5IDAtLjk5OS4yNDQtMS43NjcuNzMzLTIuMzA0LjQ4OS0uNTM3IDEuMTk1LS44MDYgMi4xMTktLjgwNi42MjcgMCAxLjE5MS4xMTYgMS42OTIuMzQ5bC0uMzgxIDEuMDE1Yy0uNTM0LS4yMDgtLjk3NC0uMzEyLTEuMzIxLS4zMTItMS4wMjggMC0xLjU0Mi42ODItMS41NDIgMi4wNDYgMCAuNjY2LjEyOCAxLjE2Ni4zODQgMS41MDEuMjU2LjMzNS42MzEuNTAyIDEuMTI1LjUwMmEzLjIzIDMuMjMgMCAwIDAgMS41OTUtLjQxOXYxLjEwMWEyLjUzIDIuNTMgMCAwIDEtLjcyMi4yODUgNC4zNTYgNC4zNTYgMCAwIDEtLjkzMi4wODZ2LjAwMnptOC4yNzctLjEwN2gtMS4yNjhWOS41MDZjMC0uNDU4LS4wOTItLjgtLjI3Ny0xLjAyNi0uMTg0LS4yMjYtLjQ3Ny0uMzM4LS44NzgtLjMzOC0uNTMgMC0uOTE5LjE1OC0xLjE2OC40NzUtLjI0OS4zMTctLjM3My44NDgtLjM3MyAxLjU5M3YyLjk0OWgtMS4yNjJWNC44MDFoMS4yNjJ2Mi4xMjJjMCAuMzQtLjAyMS43MDQtLjA2NCAxLjA5aC4wODFhMS43NiAxLjc2IDAgMCAxIC43MTctLjY2NmMuMzA2LS4xNTguNjYzLS4yMzYgMS4wNzItLjIzNiAxLjQzOSAwIDIuMTU5LjcyNSAyLjE1OSAyLjE3NXYzLjg3M2wtLjAwMS0uMDAxem03LjY0OS02LjA0OGMuNzQxIDAgMS4zMTkuMjY5IDEuNzMyLjgwNi40MTQuNTM3LjYyIDEuMjkxLjYyIDIuMjYxIDAgLjk3NC0uMjA5IDEuNzMyLS42MjggMi4yNzUtLjQxOS41NDItMS4wMDEuODE0LTEuNzQ2LjgxNC0uNzUyIDAtMS4zMzYtLjI3LTEuNzUxLS44MTFoLS4wODZsLS4yMzEuNzA0aC0uOTQ1VjQuODAxaDEuMjYydjEuOTg3bC0uMDIxLjY1NS0uMDMyLjU1M2guMDU0Yy40MDEtLjU5MS45OTItLjg4NiAxLjc3Mi0uODg2em0tLjMyOCAxLjAzMWMtLjUwOCAwLS44NzUuMTQ5LTEuMDk4LjQ0OC0uMjI0LjI5OS0uMzM5Ljc5OS0uMzQ2IDEuNTAxdi4wODZjMCAuNzIzLjExNSAxLjI0Ny4zNDQgMS41NzEuMjI5LjMyNC42MDMuNDg2IDEuMTIzLjQ4Ni40NDggMCAuNzg3LS4xNzcgMS4wMTgtLjUzMi4yMzEtLjM1NC4zNDYtLjg2Ny4zNDYtMS41MzYgMC0xLjM1LS40NjItMi4wMjUtMS4zODYtMi4wMjVsLS4wMDEuMDAxem0zLjI0NC0uOTI0aDEuMzc1bDEuMjA5IDMuMzY4Yy4xODMuNDguMzA0LjkzMS4zNjUgMS4zNTRoLjA0M2MuMDMyLS4xOTcuMDkxLS40MzYuMTc3LS43MTcuMDg2LS4yODEuNTQxLTEuNjE2IDEuMzY0LTQuMDA0aDEuMzY0bC0yLjU0MSA2LjczYy0uNDYyIDEuMjM1LTEuMjMyIDEuODUzLTIuMzEgMS44NTMtLjI3OSAwLS41NTEtLjAzLS44MTYtLjA5MXYtLjk5OWMuMTkuMDQzLjQwNi4wNjQuNjUuMDY0LjYwOSAwIDEuMDM3LS4zNTMgMS4yODQtMS4wNThsLjIyLS41NTktMi4zODUtNS45NDFoLjAwMXonIGZpbGw9JyUyMzFEMzY1NycvPjwvZz48L3N2Zz5cIik7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1zaXplOiAxMDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LWluZGVudDogLTkwMDBweDtcbiAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBibG9jaztcbn1cbiJdfQ== */
`,
'ssd.rs': `// Copyright 2016 The Rust Project Developers. See the COPYRIGHT
// file at the top-level directory of this distribution and at
// http://rust-lang.org/COPYRIGHT.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

//! Implementation of make clean in rustbuild.
//!
//! Responsible for cleaning out a build directory of all old and stale
//! artifacts to prepare for a fresh build. Currently doesn't remove the
//! build/cache directory (download cache) or the build/$target/llvm
//! directory unless the --all flag is present.

use std::fs;
use std::io::{self, ErrorKind};
use std::path::Path;

use Build;

pub fn clean(build: &Build, all: bool) {
    rm_rf("tmp".as_ref());

    if all {
        rm_rf(&build.out);
    } else {
        rm_rf(&build.out.join("tmp"));
        rm_rf(&build.out.join("dist"));

        for host in &build.hosts {
            let entries = match build.out.join(host).read_dir() {
                Ok(iter) => iter,
                Err(_) => continue,
            };

            for entry in entries {
                let entry = t!(entry);
                if entry.file_name().to_str() == Some("llvm") {
                    continue
                }
                let path = t!(entry.path().canonicalize());
                rm_rf(&path);
            }
        }
    }
}

fn rm_rf(path: &Path) {
    match path.symlink_metadata() {
        Err(e) => {
            if e.kind() == ErrorKind::NotFound {
                return;
            }
            panic!("failed to get metadata for file {}: {}", path.display(), e);
        },
        Ok(metadata) => {
            if metadata.file_type().is_file() || metadata.file_type().is_symlink() {
                do_op(path, "remove file", |p| fs::remove_file(p));
                return;
            }

            for file in t!(fs::read_dir(path)) {
                rm_rf(&t!(file).path());
            }
            do_op(path, "remove dir", |p| fs::remove_dir(p));
        },
    };
}

fn do_op<F>(path: &Path, desc: &str, mut f: F)
    where F: FnMut(&Path) -> io::Result<()>
{
    match f(path) {
        Ok(()) => {}
        // On windows we can't remove a readonly file, and git will often clone files as readonly.
        // As a result, we have some special logic to remove readonly files on windows.
        // This is also the reason that we can't use things like fs::remove_dir_all().
        Err(ref e) if cfg!(windows) &&
                      e.kind() == ErrorKind::PermissionDenied => {
            let mut p = t!(path.symlink_metadata()).permissions();
            p.set_readonly(false);
            t!(fs::set_permissions(path, p));
            f(path).unwrap_or_else(|e| {
                panic!("failed to {} {}: {}", desc, path.display(), e);
            })
        }
        Err(e) => {
            panic!("failed to {} {}: {}", desc, path.display(), e);
        }
    }
}`,
'so.c': `
#include "cache.h"
#include "alias.h"
#include "config.h"
#include "string-list.h"

struct config_alias_data {
  const char *alias;
  char *v;
  struct string_list *list;
};

static int config_alias_cb(const char *key, const char *value, void *d)
{
  struct config_alias_data *data = d;
  const char *p;

  if (!skip_prefix(key, "alias.", &p))
    return 0;

  if (data->alias) {
    if (!strcasecmp(p, data->alias))
      return git_config_string((const char **)&data->v,
             key, value);
  } else if (data->list) {
    string_list_append(data->list, p);
  }

  return 0;
}

char *alias_lookup(const char *alias)
{
  struct config_alias_data data = { alias, NULL };

  read_early_config(config_alias_cb, &data);

  return data.v;
}

void list_aliases(struct string_list *list)
{
  struct config_alias_data data = { NULL, NULL, list };

  read_early_config(config_alias_cb, &data);
}

#define SPLIT_CMDLINE_BAD_ENDING 1
#define SPLIT_CMDLINE_UNCLOSED_QUOTE 2
static const char *split_cmdline_errors[] = {
  "cmdline ends with \\",
  "unclosed quote"
};

int split_cmdline(char *cmdline, const char ***argv)
{
  int src, dst, count = 0, size = 16;
  char quoted = 0;

  ALLOC_ARRAY(*argv, size);

  /* split alias_string */
  (*argv)[count++] = cmdline;
  for (src = dst = 0; cmdline[src];) {
    char c = cmdline[src];
    if (!quoted && isspace(c)) {
      cmdline[dst++] = 0;
      while (cmdline[++src]
          && isspace(cmdline[src]))
        ; /* skip */
      ALLOC_GROW(*argv, count + 1, size);
      (*argv)[count++] = cmdline + dst;
    } else if (!quoted && (c == '\'' || c == '"')) {
      quoted = c;
      src++;
    } else if (c == quoted) {
      quoted = 0;
      src++;
    } else {
      if (c == '\\' && quoted != '\'') {
        src++;
        c = cmdline[src];
        if (!c) {
          FREE_AND_NULL(*argv);
          return -SPLIT_CMDLINE_BAD_ENDING;
        }
      }
      cmdline[dst++] = c;
      src++;
    }
  }

  cmdline[dst] = 0;

  if (quoted) {
    FREE_AND_NULL(*argv);
    return -SPLIT_CMDLINE_UNCLOSED_QUOTE;
  }

  ALLOC_GROW(*argv, count + 1, size);
  (*argv)[count] = NULL;

  return count;
}

const char *split_cmdline_strerror(int split_cmdline_errno)
{
  return split_cmdline_errors[-split_cmdline_errno - 1];
}`,
'log.py': `
#! /usr/bin/env python

"""Migrate a post-receive-email configuration to be usable with git_multimail.py.
See README.migrate-from-post-receive-email for more information.
"""

import sys
import optparse

from git_multimail import CommandError
from git_multimail import Config
from git_multimail import read_output


OLD_NAMES = [
    'mailinglist',
    'announcelist',
    'envelopesender',
    'emailprefix',
    'showrev',
    'emailmaxlines',
    'diffopts',
    'scancommitforcc',
    ]

NEW_NAMES = [
    'environment',
    'reponame',
    'mailinglist',
    'refchangelist',
    'commitlist',
    'announcelist',
    'announceshortlog',
    'envelopesender',
    'administrator',
    'emailprefix',
    'emailmaxlines',
    'diffopts',
    'emaildomain',
    'scancommitforcc',
    ]


INFO = """\
SUCCESS!
Your post-receive-email configuration has been converted to
git-multimail format.  Please see README and
README.migrate-from-post-receive-email to learn about other
git-multimail configuration possibilities.
For example, git-multimail has the following new options with no
equivalent in post-receive-email.  You might want to read about them
to see if they would be useful in your situation:
"""


def _check_old_config_exists(old):
    """Check that at least one old configuration value is set."""

    for name in OLD_NAMES:
        if name in old:
            return True

    return False


def _check_new_config_clear(new):
    """Check that none of the new configuration names are set."""

    retval = True
    for name in NEW_NAMES:
        if name in new:
            if retval:
                sys.stderr.write('INFO: The following configuration values already exist:\n\n')
            sys.stderr.write('    "%s.%s"\n' % (new.section, name))
            retval = False

    return retval


def erase_values(config, names):
    for name in names:
        if name in config:
            try:
                sys.stderr.write('...unsetting "%s.%s"\n' % (config.section, name))
                config.unset_all(name)
            except CommandError:
                sys.stderr.write(
                    '\nWARNING: could not unset "%s.%s".  '
                    'Perhaps it is not set at the --local level?\n\n'
                    % (config.section, name)
                    )


def is_section_empty(section, local):
    """Return True iff the specified configuration section is empty.
    Iff local is True, use the --local option when invoking 'git
    config'."""

    if local:
        local_option = ['--local']
    else:
        local_option = []

    try:
        read_output(
            ['git', 'config']
            + local_option
            + ['--get-regexp', '^%s\.' % (section,)]
            )
    except CommandError, e:
        if e.retcode == 1:
            # This means that no settings were found.
            return True
        else:
            raise
    else:
        return False


def remove_section_if_empty(section):
    """If the specified configuration section is empty, delete it."""

    try:
        empty = is_section_empty(section, local=True)
    except CommandError:
        # Older versions of git do not support the --local option, so
        # if the first attempt fails, try without --local.
        try:
            empty = is_section_empty(section, local=False)
        except CommandError:
            sys.stderr.write(
                '\nINFO: If configuration section "%s.*" is empty, you might want '
                'to delete it.\n\n'
                % (section,)
                )
            return

    if empty:
        sys.stderr.write('...removing section "%s.*"\n' % (section,))
        read_output(['git', 'config', '--remove-section', section])
    else:
        sys.stderr.write(
            '\nINFO: Configuration section "%s.*" still has contents.  '
            'It will not be deleted.\n\n'
            % (section,)
            )


def migrate_config(strict=False, retain=False, overwrite=False):
    old = Config('hooks')
    new = Config('multimailhook')
    if not _check_old_config_exists(old):
        sys.exit(
            'Your repository has no post-receive-email configuration.  '
            'Nothing to do.'
            )
    if not _check_new_config_clear(new):
        if overwrite:
            sys.stderr.write('\nWARNING: Erasing the above values...\n\n')
            erase_values(new, NEW_NAMES)
        else:
            sys.exit(
                '\nERROR: Refusing to overwrite existing values.  Use the --overwrite\n'
                'option to continue anyway.'
                )

    name = 'showrev'
    if name in old:
        msg = 'git-multimail does not support "%s.%s"' % (old.section, name,)
        if strict:
            sys.exit(
                'ERROR: %s.\n'
                'Please unset that value then try again, or run without --strict.'
                % (msg,)
                )
        else:
            sys.stderr.write('\nWARNING: %s (ignoring).\n\n' % (msg,))

    for name in ['mailinglist', 'announcelist']:
        if name in old:
            sys.stderr.write(
                '...copying "%s.%s" to "%s.%s"\n' % (old.section, name, new.section, name)
                )
            new.set_recipients(name, old.get_recipients(name))

    if strict:
        sys.stderr.write(
            '...setting "%s.commitlist" to the empty string\n' % (new.section,)
            )
        new.set_recipients('commitlist', '')
        sys.stderr.write(
            '...setting "%s.announceshortlog" to "true"\n' % (new.section,)
            )
        new.set('announceshortlog', 'true')

    for name in ['envelopesender', 'emailmaxlines', 'diffopts', 'scancommitforcc']:
        if name in old:
            sys.stderr.write(
                '...copying "%s.%s" to "%s.%s"\n' % (old.section, name, new.section, name)
                )
            new.set(name, old.get(name))

    name = 'emailprefix'
    if name in old:
        sys.stderr.write(
            '...copying "%s.%s" to "%s.%s"\n' % (old.section, name, new.section, name)
            )
        new.set(name, old.get(name))
    elif strict:
        sys.stderr.write(
            '...setting "%s.%s" to "[SCM]" to preserve old subject lines\n'
            % (new.section, name)
            )
        new.set(name, '[SCM]')

    if not retain:
        erase_values(old, OLD_NAMES)
        remove_section_if_empty(old.section)

    sys.stderr.write(INFO)
    for name in NEW_NAMES:
        if name not in OLD_NAMES:
            sys.stderr.write('    "%s.%s"\n' % (new.section, name,))
    sys.stderr.write('\n')


def main(args):
    parser = optparse.OptionParser(
        description=__doc__,
        usage='%prog [OPTIONS]',
        )

    parser.add_option(
        '--strict', action='store_true', default=False,
        help=(
            'Slavishly configure git-multimail as closely as possible to '
            'the post-receive-email configuration.  Default is to turn '
            'on some new features that have no equivalent in post-receive-email.'
            ),
        )
    parser.add_option(
        '--retain', action='store_true', default=False,
        help=(
            'Retain the post-receive-email configuration values.  '
            'Default is to delete them after the new values are set.'
            ),
        )
    parser.add_option(
        '--overwrite', action='store_true', default=False,
        help=(
            'Overwrite any existing git-multimail configuration settings.  '
            'Default is to abort if such settings already exist.'
            ),
        )

    (options, args) = parser.parse_args(args)

    if args:
        parser.error('Unexpected arguments: %s' % (' '.join(args),))

    migrate_config(strict=options.strict, retain=options.retain, overwrite=options.overwrite)


main(sys.argv[1:])`,
'hud.cpp': `/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

#include <grpcpp/impl/grpc_library.h>
#include <grpcpp/security/credentials.h>

namespace grpc {

static internal::GrpcLibraryInitializer g_gli_initializer;
ChannelCredentials::ChannelCredentials() { g_gli_initializer.summon(); }

ChannelCredentials::~ChannelCredentials() {}

CallCredentials::CallCredentials() { g_gli_initializer.summon(); }

CallCredentials::~CallCredentials() {}

}  // namespace grpc`,
'odd.swift': `//===----------------------------------------------------------------------===//
//
// This source file is part of the Swift.org open source project
//
// Copyright (c) 2014 - 2017 Apple Inc. and the Swift project authors
// Licensed under Apache License v2.0 with Runtime Library Exception
//
// See https://swift.org/LICENSE.txt for license information
// See https://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
//
//===----------------------------------------------------------------------===//
public extension DispatchIO {

  public enum StreamType : UInt  {
    case stream = 0
    case random = 1
  }

  public struct CloseFlags : OptionSet, RawRepresentable {
    public let rawValue: UInt
    public init(rawValue: UInt) { self.rawValue = rawValue }

    public static let stop = CloseFlags(rawValue: 1)
  }

  public struct IntervalFlags : OptionSet, RawRepresentable {
    public let rawValue: UInt
    public init(rawValue: UInt) { self.rawValue = rawValue }
    public init(nilLiteral: ()) { self.rawValue = 0 }

    public static let strictInterval = IntervalFlags(rawValue: 1)
  }

  public class func read(fromFileDescriptor: Int32, maxLength: Int, runningHandlerOn queue: DispatchQueue, handler: @escaping (_ data: DispatchData, _ error: Int32) -> Void) {
    __dispatch_read(fromFileDescriptor, maxLength, queue) { (data: __DispatchData, error: Int32) in
      handler(DispatchData(data: data), error)
    }
  }

  public class func write(toFileDescriptor: Int32, data: DispatchData, runningHandlerOn queue: DispatchQueue, handler: @escaping (_ data: DispatchData?, _ error: Int32) -> Void) {
    __dispatch_write(toFileDescriptor, data as __DispatchData, queue) { (data: __DispatchData?, error: Int32) in
      handler(data.map { DispatchData(data: $0) }, error)
    }
  }

  public convenience init(
    type: StreamType,
    fileDescriptor: Int32,
    queue: DispatchQueue,
    cleanupHandler: @escaping (_ error: Int32) -> Void)
  {
    self.init(__type: type.rawValue, fd: fileDescriptor, queue: queue, handler: cleanupHandler)
  }

  @available(swift, obsoleted: 4)
  public convenience init(
    type: StreamType,
    path: UnsafePointer<Int8>,
    oflag: Int32,
    mode: mode_t,
    queue: DispatchQueue,
    cleanupHandler: @escaping (_ error: Int32) -> Void)
  {
    self.init(__type: type.rawValue, path: path, oflag: oflag, mode: mode, queue: queue, handler: cleanupHandler)
  }

  @available(swift, introduced: 4)
  public convenience init?(
    type: StreamType,
    path: UnsafePointer<Int8>,
    oflag: Int32,
    mode: mode_t,
    queue: DispatchQueue,
    cleanupHandler: @escaping (_ error: Int32) -> Void)
  {
    self.init(__type: type.rawValue, path: path, oflag: oflag, mode: mode, queue: queue, handler: cleanupHandler)
  }

  public convenience init(
    type: StreamType,
    io: DispatchIO,
    queue: DispatchQueue,
    cleanupHandler: @escaping (_ error: Int32) -> Void)
  {
    self.init(__type: type.rawValue, io: io, queue: queue, handler: cleanupHandler)
  }

  public func read(offset: off_t, length: Int, queue: DispatchQueue, ioHandler: @escaping (_ done: Bool, _ data: DispatchData?, _ error: Int32) -> Void) {
    __dispatch_io_read(self, offset, length, queue) { (done: Bool, data: __DispatchData?, error: Int32) in
      ioHandler(done, data.map { DispatchData(data: $0) }, error)
    }
  }

  public func write(offset: off_t, data: DispatchData, queue: DispatchQueue, ioHandler: @escaping (_ done: Bool, _ data: DispatchData?, _ error: Int32) -> Void) {
    __dispatch_io_write(self, offset, data as __DispatchData, queue) { (done: Bool, data: __DispatchData?, error: Int32) in
      ioHandler(done, data.map { DispatchData(data: $0) }, error)
    }
  }

  public func setInterval(interval: DispatchTimeInterval, flags: IntervalFlags = []) {
    __dispatch_io_set_interval(self, UInt64(interval.rawValue), flags.rawValue)
  }

  public func close(flags: CloseFlags = []) {
    __dispatch_io_close(self, flags.rawValue)
  }
}`,
'pwe.yaml': `package: github.com/openshift/installer
excludeDirs:
- tests
import:
- package: github.com/ghodss/yaml
  version: 73d445a93680fa1a78ae23a5839bad48f32ba1ee
- package: github.com/Sirupsen/logrus
  version: 081307d9bc1364753142d5962fc1d795c742baaf
- package: gopkg.in/yaml.v2
  version: 53feefa2559fb8dfa8d81baad31be332c97d6c77
- package: gopkg.in/alecthomas/kingpin.v2
  version: 947dcec5ba9c011838740e680966fd7087a71d0d
- package: github.com/coreos/tectonic-config
  version: 0d649ebfd3552dfa5c6cc2cf053e17ba924b7024
- package: k8s.io/apimachinery
  version: kubernetes-1.9.0
- package: golang.org/x/crypto
  version: df8d4716b3472e4a531c33cedbe537dae921a1a9
- package: github.com/coreos/ignition
  version: v0.26.0
- package: github.com/vincent-petithory/dataurl
  version: 9a301d65acbb728fcc3ace14f45f511a4cfeea9c`,
'og.rb': `describe :kernel_sprintf_encoding, shared: true do
  def format(*args)
    @method.call(*args)
  end

  it "returns a String in the same encoding as the format String if compatible" do
    string = "%s".force_encoding(Encoding::KOI8_U)
    result = format(string, "dogs")
    result.encoding.should equal(Encoding::KOI8_U)
  end

  it "returns a String in the argument's encoding if format encoding is more restrictive" do
    string = "foo %s".force_encoding(Encoding::US_ASCII)
    argument = "b303274r".force_encoding(Encoding::UTF_8)

    result = format(string, argument)
    result.encoding.should equal(Encoding::UTF_8)
  end

  it "raises Encoding::CompatibilityError if both encodings are ASCII compatible and there ano not ASCII characters" do
    string = "Ä %s".encode('windows-1252')
    argument = "Ђ".encode('windows-1251')

    -> () {
      format(string, argument)
    }.should raise_error(Encoding::CompatibilityError)
  end
end`,
'server.ts': `// Type definitions for passport-github2 1.2
// Project: https://github.com/jaredhanson/passport-github
// Definitions by: Yasunori Ohoka <https://github.com/yasupeke>
//                 Maarten Mulders <https://github.com/mthmulders>
//                 Christoph Werner <https://github.com/codepunkt>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8
import passport = require('passport');
import oauth2 = require('passport-oauth2');
import express = require('express');

export interface Profile extends passport.Profile {
    profileUrl: string;
}

export interface StrategyOption extends passport.AuthenticateOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;

    scope?: string[];
    userAgent?: string;
    state?: boolean;

    authorizationURL?: string;
    tokenURL?: string;
    scopeSeparator?: string;
    customHeaders?: string;
    userProfileURL?: string;
}

export type OAuth2StrategyOptionsWithoutRequiredURLs = Pick<
    oauth2._StrategyOptionsBase,
    Exclude<keyof oauth2._StrategyOptionsBase , 'authorizationURL' | 'tokenURL'>
>;

export interface _StrategyOptionsBase extends OAuth2StrategyOptionsWithoutRequiredURLs {
    clientID: string;
    clientSecret: string;
    callbackURL: string;

    scope?: string[];
    userAgent?: string;
    state?: boolean;

    authorizationURL?: string;
    tokenURL?: string;
    scopeSeparator?: string;
    customHeaders?: string;
    userProfileURL?: string;
}

export interface StrategyOptions extends _StrategyOptionsBase {
    passReqToCallback?: false;
}
export interface StrategyOptionsWithRequest extends _StrategyOptionsBase {
    passReqToCallback: true;
}

export class Strategy extends oauth2.Strategy {
    constructor(options: StrategyOptions, verify: oauth2.VerifyFunction);
    constructor(options: StrategyOptionsWithRequest, verify: oauth2.VerifyFunctionWithRequest);
    userProfile(accessToken: string, done: (err?: Error | null, profile?: any) => void): void;

    name: string;
    authenticate(req: express.Request, options?: passport.AuthenticateOptions): void;
}`,
'config.json': `{
    "compilerOptions": {
        "module": "commonjs",
        "lib": [
            "es6"
        ],
        "noImplicitAny": true,
        "noImplicitThis": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "baseUrl": "../",
        "typeRoots": [
            "../"
        ],
        "types": [],
        "noEmit": true,
        "forceConsistentCasingInFileNames": true
    },
    "files": [
        "index.d.ts",
        "swagger-ui-express-tests.ts"
    ]
}`,
'init.go': `// created by cgo -cdefs and then converted to Go
// cgo -cdefs defs_netbsd.go defs_netbsd_amd64.go

package runtime

const (
  _EINTR  = 0x4
  _EFAULT = 0xe

  _PROT_NONE  = 0x0
  _PROT_READ  = 0x1
  _PROT_WRITE = 0x2
  _PROT_EXEC  = 0x4

  _MAP_ANON    = 0x1000
  _MAP_PRIVATE = 0x2
  _MAP_FIXED   = 0x10

  _MADV_FREE = 0x6

  _SA_SIGINFO = 0x40
  _SA_RESTART = 0x2
  _SA_ONSTACK = 0x1

  _SIGHUP    = 0x1
  _SIGINT    = 0x2
  _SIGQUIT   = 0x3
  _SIGILL    = 0x4
  _SIGTRAP   = 0x5
  _SIGABRT   = 0x6
  _SIGEMT    = 0x7
  _SIGFPE    = 0x8
  _SIGKILL   = 0x9
  _SIGBUS    = 0xa
  _SIGSEGV   = 0xb
  _SIGSYS    = 0xc
  _SIGPIPE   = 0xd
  _SIGALRM   = 0xe
  _SIGTERM   = 0xf
  _SIGURG    = 0x10
  _SIGSTOP   = 0x11
  _SIGTSTP   = 0x12
  _SIGCONT   = 0x13
  _SIGCHLD   = 0x14
  _SIGTTIN   = 0x15
  _SIGTTOU   = 0x16
  _SIGIO     = 0x17
  _SIGXCPU   = 0x18
  _SIGXFSZ   = 0x19
  _SIGVTALRM = 0x1a
  _SIGPROF   = 0x1b
  _SIGWINCH  = 0x1c
  _SIGINFO   = 0x1d
  _SIGUSR1   = 0x1e
  _SIGUSR2   = 0x1f

  _FPE_INTDIV = 0x1
  _FPE_INTOVF = 0x2
  _FPE_FLTDIV = 0x3
  _FPE_FLTOVF = 0x4
  _FPE_FLTUND = 0x5
  _FPE_FLTRES = 0x6
  _FPE_FLTINV = 0x7
  _FPE_FLTSUB = 0x8

  _BUS_ADRALN = 0x1
  _BUS_ADRERR = 0x2
  _BUS_OBJERR = 0x3

  _SEGV_MAPERR = 0x1
  _SEGV_ACCERR = 0x2

  _ITIMER_REAL    = 0x0
  _ITIMER_VIRTUAL = 0x1
  _ITIMER_PROF    = 0x2

  _EV_ADD       = 0x1
  _EV_DELETE    = 0x2
  _EV_CLEAR     = 0x20
  _EV_RECEIPT   = 0
  _EV_ERROR     = 0x4000
  _EV_EOF       = 0x8000
  _EVFILT_READ  = 0x0
  _EVFILT_WRITE = 0x1
)

type sigset struct {
  __bits [4]uint32
}

type siginfo struct {
  _signo  int32
  _code   int32
  _errno  int32
  _pad    int32
  _reason [24]byte
}

type stackt struct {
  ss_sp     uintptr
  ss_size   uintptr
  ss_flags  int32
  pad_cgo_0 [4]byte
}

type timespec struct {
  tv_sec  int64
  tv_nsec int64
}

func (ts *timespec) set_sec(x int32) {
  ts.tv_sec = int64(x)
}

func (ts *timespec) set_nsec(x int32) {
  ts.tv_nsec = int64(x)
}

type timeval struct {
  tv_sec    int64
  tv_usec   int32
  pad_cgo_0 [4]byte
}

func (tv *timeval) set_usec(x int32) {
  tv.tv_usec = x
}

type itimerval struct {
  it_interval timeval
  it_value    timeval
}

type mcontextt struct {
  __gregs     [26]uint64
  _mc_tlsbase uint64
  __fpregs    [512]int8
}

type ucontextt struct {
  uc_flags    uint32
  pad_cgo_0   [4]byte
  uc_link     *ucontextt
  uc_sigmask  sigset
  uc_stack    stackt
  uc_mcontext mcontextt
}

type keventt struct {
  ident     uint64
  filter    uint32
  flags     uint32
  fflags    uint32
  pad_cgo_0 [4]byte
  data      int64
  udata     *byte
}

// created by cgo -cdefs and then converted to Go
// cgo -cdefs defs_netbsd.go defs_netbsd_amd64.go

const (
  _REG_RDI    = 0x0
  _REG_RSI    = 0x1
  _REG_RDX    = 0x2
  _REG_RCX    = 0x3
  _REG_R8     = 0x4
  _REG_R9     = 0x5
  _REG_R10    = 0x6
  _REG_R11    = 0x7
  _REG_R12    = 0x8
  _REG_R13    = 0x9
  _REG_R14    = 0xa
  _REG_R15    = 0xb
  _REG_RBP    = 0xc
  _REG_RBX    = 0xd
  _REG_RAX    = 0xe
  _REG_GS     = 0xf
  _REG_FS     = 0x10
  _REG_ES     = 0x11
  _REG_DS     = 0x12
  _REG_TRAPNO = 0x13
  _REG_ERR    = 0x14
  _REG_RIP    = 0x15
  _REG_CS     = 0x16
  _REG_RFLAGS = 0x17
  _REG_RSP    = 0x18
  _REG_SS     = 0x19
)`,
'sc.lua': `_addon.name = "FastCS"
_addon.author = "Cairthenn"
_addon.version = "1.2"
_addon.commands = {"FastCS","FCS"}

--Requires:

require("luau")

-- Settings:

defaults = {}
defaults.frame_rate_divisor = 2
defaults.exclusions = S{"home point #1", "home point #2", "home point #3", "home point #4", "home point #5", "survival guide", "waypoint"}
settings = config.load(defaults)

-- Globals:
__Globals = {
    enabled = false, -- Boolean that indicates whether the Config speed-up is currently enabled
    zoning  = false, -- Boolean that indicates whether the player is zoning with the config speed-up enabled
}

-- Help text definition:

helptext = [[FastCS - Command List:
1. help - Displays this help menu.
2a. fps [30|60|uncapped]
2b. frameratedivisor [2|1|0]
  - Changes the default FPS after exiting a cutscene.
  - The prefix can be used interchangeably. For example, "fastcs fps 2" will set the default to 30 FPS.
3. exclusion [add|remove] <name>
    - Adds or removes a target from the exclusions list. Case insensitive.
 ]]
 
function disable()

    __Globals.enabled = false
    
    windower.send_command("config FrameRateDivisor ".. (settings.frame_rate_divisor or 2))
    
end

function enable()
    
    __Globals.enabled = true
    
    windower.send_command("config FrameRateDivisor 0")

end

windower.register_event('unload',disable)
windower.register_event('logout',disable)
windower.register_event('outgoing chunk',function(id)

    if id == 0x00D and __Globals.enabled then -- Last packet sent when zoning out
        disable()
        __Globals.zoning = true
    end
    
end)

windower.register_event('incoming chunk',function(id,o,m,is_inj)

    if id == 0x00A and not is_inj and __Globals.zoning then
        enable()
        __Globals.zoning = false
    end
    
end)

windower.register_event('load',function()
    local player = windower.ffxi.get_player()
    
    if player and player.status == 4 then
        windower.send_command("config FrameRateDivisor 0")
    end
    
end)

windower.register_event("status change", function(new,old)
    
    local target = windower.ffxi.get_mob_by_target('t')
    
    if not target or target and not settings.exclusions:contains(target.name:lower()) then
    
        if new == 4 then
            enable()
        elseif old == 4 then
            disable()
        end

    end
    
end)

windower.register_event("addon command", function (command,...)
    command = command and command:lower() or "help"
    local args = T{...}:map(string.lower)
    
    if command == "help" then
        print(helptext)
    elseif command == "fps" or command == "frameratedivisor" then
        if #args == 0 then
            settings.frame_rate_divisor = (settings.frame_rate_divisor + 1) % 3
            local help_message = (settings.frame_rate_divisor == 0) and "Uncapped" or (settings.frame_rate_divisor == 1) and "60 FPS" or (settings.frame_rate_divisor == 2) and "30 FPS"
            notice("Default frame rate divisor is now: " .. settings.frame_rate_divisor .. " (" .. help_message .. ")" )
        elseif #args == 1 then
            if args[1] == "60" or args[1] == "1" then
                settings.frame_rate_divisor = 1
            elseif args[1] == "30" or args[1] == "2" then
                settings.frame_rate_divisor = 2
            elseif args[1] == "uncapped" or args[1] == "0" then
                settings.frame_rate_divisor = 0
            end
            local help_message = (settings.frame_rate_divisor == 0) and "Uncapped" or (settings.frame_rate_divisor == 1) and "60 FPS" or (settings.frame_rate_divisor == 2) and "30 FPS"
            notice("Default frame rate divisor is now: " .. settings.frame_rate_divisor .. " (" .. help_message .. ")" )
        else
            error("The command syntax was invalid.")
        end
        settings:save()
    elseif command == "exclusion" then
        if #args == 2 then
            if args[1] == "add" then
                settings.exclusions:add(args[2]:lower())
                notice(args[2] .. " added to the exclusions list.")
            elseif args[1] == "remove" then
                settings.exclusions:remove(args[2]:lower())
                notice(args[2] .. " removed from the exclusions list.")
            else
                error("The command syntax was invalid.")
            end
        else
            error("The command syntax was invalid.")
        end
    else
        error("The command syntax was invalid.")
    end
end)`,
'query.sql': `SELECT [ALL | DISTINCT] select_expr, select_expr, ...
FROM table_reference
[WHERE where_condition]
[GROUP BY col_list]
[HAVING having_condition]
[CLUSTER BY col_list | [DISTRIBUTE BY col_list] [SORT BY col_list]]
[LIMIT number]
;`,
'tb.xml': `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE stylesheet [
<!ENTITY converterBody SYSTEM "FHIRConverterBody.js">
]>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:fhir="http://hl7.org/fhir" version="1.0">
  
  <xsl:output method="text"/>

  <!-- Creates the variabe FHIRdefs[] which is a JavaScript object containing
    a representation of the FHIR Schemas
    -->
  <xsl:template match="/">
    <xsl:text>&#xA;function FHIRConverter(indent) {
        this.indent = indent;
        this.xml = "";
        /* For output */
        this.out = function(str) {
          xml += str;
        }
        this.reset = function() { xml = ""; }
        this.getResult = function() { return xml; }
        /* For diagnostics */
        this.msg = function(str) {
          alert(str);
        }
    </xsl:text>
    <xsl:text>&#xA;  this.FHIRdefs = {</xsl:text>
    <!-- Create an entry for each complex or simple type
      At present, only complexTypes are actually used 
      -->
    <xsl:apply-templates select="xs:schema/xs:complexType"/><!-- |xs:schema/xs:simpleType -->
    <xsl:text>&#xA;  };</xsl:text>
    <!--  Insert the body of the converter from FHIRConverterBody.js here -->
    &converterBody;
    <xsl:text>&#xA;}</xsl:text>
  </xsl:template>

  <!-- Create a JavaScript object representing a complexType 
    The general form is
    "ElementName": {
      /* Comment describing it */
      "name": "TypeName", // For diagnostics
      "base": "BaseType", // For recursion into base types [see template: xs:complexContent/xs:extension mode="base" 
      "attrs": [  // List of child attributes, see template xs:attribute
      ],
      "elems": [  // List of child elements, see template xs:element
      ],
    }
  -->
  <xsl:template match="xs:complexType">
    <xsl:text>&#xA;"</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>": {</xsl:text>
    <xsl:apply-templates select="xs:annotation" mode="doc"/>
    <xsl:text>&#xA;  "name": "</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>",</xsl:text>
    <xsl:apply-templates select="xs:complexContent/xs:extension" mode="base"/>
    <xsl:text>&#xA;  "attrs": [</xsl:text>
    <xsl:apply-templates select=".//xs:attribute"/>
    <xsl:text>&#xA;  ],</xsl:text>
    <xsl:text>&#xA;  "elems": [</xsl:text>
    <xsl:apply-templates select="xs:sequence|xs:choice|xs:complexContent/xs:extension|xs:complexContent/xs:restriction"/>
    <xsl:text>&#xA;  ]</xsl:text>
    <xsl:text>&#xA;},</xsl:text>
  </xsl:template>

  <!--
    Process child sequences, choices or elements of extensions, 
    but not attributes, as these are handled in a separate pass    
  -->
  <xsl:template match="xs:complexContent/xs:extension|xs:complexContent/xs:restriction">
    <xsl:apply-templates select="xs:sequence/*|xs:choice|xs:element"/>
  </xsl:template>

  <!--
    Process a simpleType
    The general form is:
    "typeName": {
      "name": "typeName", // Again for diagnostics
      "base": "baseTypeName", // The base type  
      "minLength": "value",   // minLength if present
      "maxLength": "value",   // maxLength if present
      "minLength": "value",   // minLength if present
      "patterns": [ // Patterns if present
        "pattern1",
        ...
        "patternn",
      ]
      "values": [ // Enumeration values if present
        "value1",
          ...
        "valuen",
      ]
    },    
  -->
  <xsl:template match="xs:simpleType">
    <xsl:text>&#xA;"</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>": {</xsl:text>
    <xsl:apply-templates select="xs:annotation" mode="doc"/>
    <xsl:text>&#xA;  "name": "</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>",</xsl:text>
    <xsl:apply-templates select="xs:restriction" mode="base"/>
    <xsl:if test=".//xs:minLength">
      <xsl:text>&#xA;  "minLength": "</xsl:text>
      <xsl:value-of select=".//xs:minLength/@value"/>
      <xsl:text>", </xsl:text>
    </xsl:if>
    <xsl:if test=".//xs:maxLength">
      <xsl:text>&#xA;  "maxLength": "</xsl:text>
      <xsl:value-of select=".//xs:maxLength/@value"/>
      <xsl:text>", </xsl:text>
    </xsl:if>
    <xsl:if test=".//xs:pattern">
      <xsl:text>&#xA;  "patterns": [</xsl:text>
      <xsl:for-each select=".//xs:pattern">
        <xsl:text>&#xA;    "</xsl:text>
        <xsl:value-of select="@value"/>
        <xsl:text>",</xsl:text>
      </xsl:for-each>
      <xsl:text>&#xA;  ],</xsl:text>
    </xsl:if>
    <xsl:if test=".//xs:enumeration">
      <xsl:text>&#xA;  "values": [</xsl:text>
      <xsl:for-each select=".//xs:enumeration">
        <xsl:text>&#xA;    "</xsl:text>
        <xsl:value-of select="@value"/>
        <xsl:text>",</xsl:text>
      </xsl:for-each>
      <xsl:text>&#xA;  ]</xsl:text>
    </xsl:if>
    <xsl:text>&#xA;},</xsl:text>
  </xsl:template>

  <!-- Stop default rule -->
  <xsl:template match="text()"/>

  <!-- Generate "base": "baseTypeName" or
                "union": [ "type1", ... "typen" ]
       from the model 
  -->
  <xsl:template match="xs:extension|xs:restriction" mode="base">
    <xsl:choose>
      <xsl:when test="@base">
        <xsl:text>&#xA;  "base": "</xsl:text>
        <xsl:value-of select="@base"/>
        <xsl:text>", </xsl:text>
      </xsl:when>
      <xsl:when test=".//xs:union">
        <xsl:text>&#xA;  "union": [</xsl:text>
        <xsl:text>&#xA;     </xsl:text>
        <xsl:apply-templates select=".//xs:union"/>
        <xsl:text>], </xsl:text>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <!-- recursively process @memberTypes space separated list 
       into comma separate array of strings
    -->
  <xsl:template match="xs:union" name="union">
    <xsl:param name="values" select="normalize-space(./@memberTypes)"/>
    <xsl:variable name="left" select="substring-before(concat($values,' '),' ')"/>
    <xsl:variable name="right" select="substring-after($values,' ')"/>
    <xsl:text>"</xsl:text>
    <xsl:value-of select="$left"/>
    <xsl:text>", </xsl:text>
    <xsl:if test="$right != ''">
      <xsl:call-template name="union">
        <xsl:with-param name="values" select="$right"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- Within a seqence, process its child choices, sequences or elements -->
  <xsl:template match="xs:sequence">
    <xsl:apply-templates select="xs:annotation" mode="doc"/>
    <xsl:apply-templates select="xs:choice|xs:sequence|xs:element"/>
  </xsl:template>

  <!-- A choice is expressed as an array of possible elements --> 
  <xsl:template match="xs:choice">
    <xsl:text>&#xA;    [ /* Choice */ </xsl:text>
    <xsl:apply-templates select="xs:annotation" mode="doc"/>
    <xsl:apply-templates select="xs:element">
      <xsl:with-param name="choice" select="true()"/>
    </xsl:apply-templates>
    <xsl:text>&#xA;    ], </xsl:text>
  </xsl:template>

  <!-- represent an attribute, the general form is 
    { "name": "attributeName",
      "type": "attributeType"\
    }
  -->
  <xsl:template match="xs:attribute">
    <xsl:text>&#xA;    { </xsl:text>
    <xsl:apply-templates select="xs:annotation" mode="doc"/>
    <xsl:text>&#xA;      "name": "</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>", </xsl:text>
    <xsl:text>&#xA;      "type": "</xsl:text>
    <xsl:value-of select="@type"/>
    <xsl:text>" }, </xsl:text>
  </xsl:template>

  <!-- represent an element, the geneeral form is 
    { "name": "elementName",
      "min": "minCardinalityValue",
      "max": "maxCardinalityValue",
      "type": "elementType",
      "isPrimitive": booleanValue // Based on whether this element is a FHIR Primitive type 
    }
  -->
  <xsl:template match="xs:element">
    <xsl:param name="choice" select="false()"/>
    <xsl:variable name="lead">
      <xsl:text>&#xA;    </xsl:text>
      <xsl:if test="$choice">
        <xsl:text>    </xsl:text>
      </xsl:if>
    </xsl:variable>
    <xsl:value-of select="$lead"/>
    <xsl:text>{ </xsl:text>
    <xsl:apply-templates select="xs:annotation" mode="doc"/>
    <xsl:text>  "name": "</xsl:text>
    <xsl:value-of select="@name|@ref"/>
    <xsl:text>", </xsl:text>
    <xsl:value-of select="$lead"/>
    <xsl:choose>
      <xsl:when test="@minOccurs">
        <xsl:value-of select="$lead"/>
        <xsl:text>  "min": "</xsl:text>
        <xsl:value-of select="@minOccurs"/>
        <xsl:text>", </xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$lead"/><xsl:text>  "min": "</xsl:text>1<xsl:text>", </xsl:text>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:choose>
      <xsl:when test="@maxOccurs">
        <xsl:value-of select="$lead"/>
        <xsl:text>  "max": "</xsl:text>
        <xsl:value-of select="@maxOccurs"/>
        <xsl:text>", </xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$lead"/><xsl:text>  "max": "</xsl:text>1<xsl:text>", </xsl:text>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:value-of select="$lead"/>
    <xsl:text>  "type": "</xsl:text>
    <xsl:value-of select="@type"/>
    <xsl:if test="not(@type)"><xsl:value-of select='@ref'/></xsl:if>
    <xsl:text>",</xsl:text>
    <xsl:value-of select="$lead"/>
    <xsl:text>  "isPrimitive": </xsl:text>
    <xsl:variable name='def' select="//xs:complexType[@name = current()/@type]"/>
    <xsl:value-of select="$def//xs:extension/@base = 'Element' and count($def//xs:element)=0"/>
    <xsl:text> }, </xsl:text>
  </xsl:template>

  <!-- Generate a comment based on the FHIR documentation -->
  <xsl:template match="xs:annotation" mode="doc">
    <xsl:text>&#xA;    /*</xsl:text>
    <xsl:for-each select="xs:documentation">
      <xsl:value-of select="."/>
    </xsl:for-each>
    <xsl:text>&#xA;     */</xsl:text>
  </xsl:template>

</xsl:stylesheet>`,
'config.yaml': `[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true
[remote "origin"]
  url = https://github.com/SurenAt93/glex.git
  fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
  remote = origin
  merge = refs/heads/master`,
};

export default sampleFiles;
