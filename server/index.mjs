import { __getDirname, connectMessage } from './utils/';
const __dirname = __getDirname(import.meta.url);

import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import globalConfig from './config';
import cors from 'cors';
import errorHandler from './errorHandler';

import path from 'path';

const [, entryFile] = process.argv;
const __main__ = path.dirname(entryFile) === __dirname;

const server = {
  async start(config) {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(errorHandler);

    const server = http.createServer(app);

    const port = (config && config.port) || globalConfig.get('port');

    server.listen(port, connectMessage({ port }));
  }
};

if(__main__) {
  server.start();
}

export default server;