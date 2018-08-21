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

const server = {
  async start(config) {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(errorHandler);

    const server = http.createServer(app);

    server.listen(
      (config && config.port)|| globalConfig.get('port'),
      connectMessage,
    );
  }
}

export default server;
