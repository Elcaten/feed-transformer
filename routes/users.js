var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser');
var request = require('request');

/* GET users listing. */
router.get('/', function(inboundReq, res, next) {
  // var req = request('http://ec2-13-53-128-81.eu-north-1.compute.amazonaws.com:1200/telegram/channel/nevermind_the_gap')
  var req = request('https://vas3k.ru/rss/')
  var feedparser = new FeedParser();

  req.on('error', function (error) {
    // res.send('error')
    console.log('FUCKING FUKC')    
    console.log(error)
  });
  
  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream
  
    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });
  
  feedparser.on('error', function (error) {
    //res.send('error')
    console.log('FUCKING FUKC')
    console.log(error)
  });

  feedparser.on('readable', function () {
    console.log('READABLE')
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;
  
    const items = []
    while (item = stream.read()) {
      items.push(item)
    }
    // res.send(items);
  });
});

module.exports = router;
