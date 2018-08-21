import figlet from 'figlet';

const connectMessage = _ => figlet.text('connect', (err, data) => {
  err && console.error(err); // TODO ::: Create ErrorHandler
  console.log(data);
});

export default connectMessage;
