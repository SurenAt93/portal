import server from './server';
import config from './config';

server.start(config.get('server'));
