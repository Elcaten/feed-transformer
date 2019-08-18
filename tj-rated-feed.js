const feedparser = require("feedparser-promised");
const request = require("request-promise");
const cheerio = require("cheerio");
const schedule = require("node-schedule");

class TjRatedFeed {
  constructor() {
    this.items_with_rating = this._refresh_items()
    schedule.scheduleJob("0 0 * * *", () => this.items_with_rating = this._refresh_items()); // run everyday at midnight
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
      }, 1);
    });
  }

  _get_rating(link) {
    return Promise.resolve(Math.floor(Math.random() * 50000))
    // return request({ uri: link, transform: body => cheerio.load(body) })
    //   .then($ => {
    //     const ratingText = $(".article-footer__views")
    //       .text()
    //       .replace(/\s/, "");
    //     return Number.parseInt(ratingText) || -1;
    //   })
    //   .catch(err => -1);
  }
}

module.exports = new TjRatedFeed();
