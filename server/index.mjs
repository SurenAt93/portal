import { __getDirname, connectMessage } from './utils/';
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
