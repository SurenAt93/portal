import figlet from 'figlet';

const connectMessage = options => _ => figlet.text('connect', (err, data) => {
  err && console.error(err); // TODO ::: Create ErrorHandler
  console.log(data);
  options.port && console.log('Log ::: Port is', options.port);
});

export default connectMessage;
