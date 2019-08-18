const feedparser = require("feedparser-promised");
const request = require("request-promise");
const cheerio = require("cheerio");
const schedule = require("node-schedule");
var initial_items = require('./public/data/initial_feed.json')

class TjRatedFeed {
  constructor() {
    this.items_with_rating = initial_items

    // run everyday at midnight
    schedule.scheduleJob("0 0 * * *", async () => {
      const new_items = await this._refresh_items()
      this.items_with_rating = new_items
    }); 
  }

  async _refresh_items() {
    const items = await feedparser.parse("https://journal.tinkoff.ru/feed");
    const items_with_rating = await this._map_to_items_with_rating(items);
    return items_with_rating
  }

  _map_to_items_with_rating(items) {
    return new Promise((resolve, reject) => {
      let i = 0;
      const itemsWithRating = [];

      const interval = setInterval(async () => {
        if (i >= items.length) {
          clearInterval(interval);
          resolve(itemsWithRating);
        } else {
          const rating = await this._get_rating(items[i].link);
          itemsWithRating.push({ item: items[i], rating });
          i++;
        }
      }, 6 * 1000);
    });
  }

  _get_rating(link) {
    return request({ uri: link, transform: body => cheerio.load(body) })
      .then($ => {
        const ratingText = $(".article-footer__views")
          .text()
          .replace(/\s/, "");
        console.log(ratingText)
        return Number.parseInt(ratingText) || -1;
      })
      .catch(err => -1);
  }
}

module.exports = new TjRatedFeed();
