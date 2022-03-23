const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  // redisClient.hset('values', message, fib(parseInt(message)));
  redisClient.hmget('values', message, function(err, dataArr) {
    if (err) console.error(err);
    const data = dataArr[0];
    console.log(message, data);
    if (data === null || toString(data) === toString(-1)) {
      console.log("Here")
      redisClient.hset('values', message, parseInt(fib(parseInt(message))));
    }
  });
  
});
sub.subscribe('insert');
