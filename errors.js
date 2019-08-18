var { BehaviorSubject } = require("rxjs");

class Errors {
  constructor() {
    this.errors = new BehaviorSubject([]);
  }
}

module.exports = new Errors();
