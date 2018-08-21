import path  from 'path';
import nconf from 'nconf';

import { __getDirname } from '../utils/';
const __dirname = __getDirname(import.meta.url);

nconf
  .argv()
  .env()
  .file({
    file: path.join(__dirname, 'config.json'),
  });

export default nconf;
