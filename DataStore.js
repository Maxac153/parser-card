const Store = require("electron-store");
const puppeteer = require("puppeteer");
const fs = require("fs");

// C:\Users\Turgor\AppData\Roaming\card-date

let postUrl;
let scrapeArray = async (cardData) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let result = [];
  let i = 0;
  for (let postUrl of cardData) {
    await page.goto(postUrl, { waitUntil: "networkidle2" });
    result.push(
      await page.evaluate(() => {
        let nameCardAdd =
          document.querySelector(".productView-title").innerText;
        let foil = document.querySelector("#custom-field--Finish").innerText;
        let set = document.querySelector(".category-name-title").innerText;
        let mode =
          document.querySelector(".productView-subtitle").innerText == "English"
            ? ""
            : document.querySelector(".productView-subtitle").innerText;
        let OutOfStockAdd = document.getElementById("InStockNotifyOutOfStock")
          ? "✖"
          : "";
        let priceAdd = document
          .querySelector(".price--non-sale")
          .innerText.trim()
          .slice(1);
        if (priceAdd == "") {
          priceAdd = document
            .querySelector(".price--withoutTax")
            .innerText.slice(1);
        }
        return {
          nameCardAdd,
          OutOfStockAdd,
          priceAdd,
          foil,
          mode,
          set,
        };
      })
    );
  }
  browser.close();
  return result;
};

class DataStore extends Store {
  constructor(settings) {
    super(settings);
    this.links = this.get("card-link") || [];
    this.number = this.get("number-card") || [];
    this.cardName = this.get("card-name") || [];
    this.price = this.get("price") || [];
    this.outOfStock = this.get("Out-Of-Stock") || [];
    this.foil = this.get("Foil") || [];
    this.mode = this.get("Mode") || [];
    this.Set = this.get("Set") || [];
  }

  savecards() {
    this.set("card-link", this.links);
    this.set("number-card", this.number);
    this.set("card-name", this.cardName);
    this.set("price", this.price);
    this.set("Out-Of-Stock", this.outOfStock);
    this.set("Foil", this.foil);
    this.set("Mode", this.mode);
    this.set("Set", this.Set);
    return this;
  }

  getcards() {
    this.links = this.get("card-link") || [];
    this.number = this.get("number-card") || [];
    this.cardName = this.get("card-name") || [];
    this.price = this.get("price") || [];
    this.outOfStock = this.get("Out-Of-Stockk") || [];
    this.foil = this.get("Foil") || [];
    this.mode = this.get("Mode") || [];
    this.Set = this.get("Set") || [];
    return this;
  }

  async updateDate(cardData) {
    await scrapeArray(cardData["links"]).then((value) => {
      for (let i = 0; i < value.length; i++) {
        this.price[i] = value[i].priceAdd;
        this.outOfStock[i] = value[i].OutOfStockAdd;
      }
      return this.savecards();
    });
  }

  async addCards(cardDate, link, numberCard) {
    await scrapeArray(link).then((value) => {
      for (let i = 0; i < value.length; i++) {
        this.cardName = [...this.cardName, value[i].nameCardAdd];
        this.price = [...this.price, value[i].priceAdd];
        this.outOfStock = [...this.outOfStock, value[i].OutOfStockAdd];
        this.links = [...this.links, link[i]];
        this.number = [...this.number, numberCard[i]];
        this.foil = [...this.foil, value[i].foil];
        this.mode = [...this.mode, value[i].mode];
        this.Set = [...this.Set, value[i].set];
      }
      return this.savecards();
    });
  }

  async updatePrice(id) {
    postUrl = id;
    let i = 0;
    for (i; i < this.links.length; i++) {
      if (this.links[i].indexOf(id) != -1) {
        break;
      }
    }
    await scrapeArray([this.links[i]]).then((value) => {
      this.price[i] = value[0].priceAdd;
      this.outOfStock[i] = value[0].OutOfStockAdd;
      return this.savecards();
    });
  }

  async addCard(link, num) {
    await scrapeArray([link]).then((value) => {
      this.cardName = [...this.cardName, value[0].nameCardAdd];
      this.price = [...this.price, value[0].priceAdd];
      this.outOfStock = [...this.outOfStock, value[0].OutOfStockAdd];
      this.links = [...this.links, link];
      this.number = [...this.number, num];
      this.foil = [...this.foil, value[0].foil];
      this.mode = [...this.mode, value[0].mode];
      this.Set = [...this.Set, value[0].set];
      return this.savecards();
    });
  }

  updateNumber(link, number) {
    for (let i = 0; i < this.links.length; i++) {
      if (link.indexOf(this.links[i]) != -1) {
        this.number[i] = number;
      }
    }
    return this.savecards();
  }

  deleteItem(link) {
    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i] == link) {
        this.number.splice(i, 1);
        this.cardName.splice(i, 1);
        this.price.splice(i, 1);
        this.outOfStock.splice(i, 1);
        this.links.splice(i, 1);
        this.foil.splice(i, 1);
        this.mode.splice(i, 1);
        this.Set.splice(i, 1);
      }
    }
    return this.savecards();
  }
}

module.exports = DataStore;
