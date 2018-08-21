import server from './server';
import config from './config';

server.start({ port: config.get('server_port') });
