const express = require("express");
const router = express.Router();
const RSS = require("rss");
const tjRatedFeed = require("../tj-rated-feed");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    const top = req.query.top || 20
    const items = tjRatedFeed.items_with_rating
    const top_items = items
      .sort((a, b) => b.rating - a.rating)
      .slice(0, top);
  
      var exportFeed = new RSS({
        title: "Т-Ж",
        description: "Т-Ж custom feed",
        feed_url: "https://journal.tinkoff.ru/feed",
        site_url: "https://journal.tinkoff.ru",
        language: "ru",
        categories: [],
        pubDate: "Aug 18, 2019 04:00:00 GMT",
        ttl: "1200"
      });
  
    for (const { item, rating } of top_items) {
      exportFeed.item({
        title: item.title,
        description: item.description,
        url: item.link,
        guid: item.guid,
        categories: item.categories,
        author: item.author,
        date: item.date
      });
    }
  
    res.send(exportFeed.xml());
    
  } catch(err) {
    next(err)
  }
});

module.exports = router;
