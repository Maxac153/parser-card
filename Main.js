const path = require("path");
const { app, ipcMain } = require("electron");

const Window = require("./Window");
const DataStore = require("./DataStore");

const exportUsersToExcel = require("./ExportService");

const workSheetColumnNames = [
  "Количество",
  "Название",
  "Цена в рублях",
  "Цена в долларах",
  "Наличие",
  "Сет",
  "Прочие данные",
  "Фоил",
  "Ссылка",
];

const workSheetName = "Cards";
const filePath = "Cards.xlsx";
const cardData = new DataStore({ name: "Cards Main" });

function main() {
  let mainWindow = new Window({
    file: path.join("renderer", "index.html"),
  });

  mainWindow.once("show", () => {
    mainWindow.webContents.send("links", cardData);
  });

  let addCardWin;
  ipcMain.on("add-card-window", () => {
    if (!addCardWin) {
      addCardWin = new Window({
        file: path.join("renderer", "add.html"),
        width: 700,
        height: 500,
        minWidth: 700,
        minHeight: 500,
        maxWidth: 700,
        maxHeight: 500,
        parent: mainWindow,
      });

      addCardWin.on("closed", () => {
        addCardWin = null;
      });
    }
  });

  ipcMain.on("add-card", async (event, link, num) => {
    await cardData.addCard(link, num);
    await mainWindow.send("links", cardData);
  });

  ipcMain.on("add-cards", async (event, link, numberCard) => {
    await mainWindow.send("hide", cardData);
    await cardData.addCards(cardData, link, numberCard);
    await mainWindow.send("links", cardData);
  });

  ipcMain.on("update", async (event) => {
    await cardData.updateDate(cardData);
    await mainWindow.send("links", cardData);
  });

  ipcMain.on("rerender", async (event) => {
    await mainWindow.send("links", cardData);
  });

  ipcMain.on("export-excel", (event, rateCard) => {
    exportUsersToExcel(
      cardData,
      workSheetColumnNames,
      workSheetName,
      filePath,
      rateCard
    );
  });

  ipcMain.on("update-price", async (event, id) => {
    await cardData.updatePrice(id);
    await mainWindow.send("links", cardData);
  });

  ipcMain.on("update-number", (event, link, number) => {
    cardData.updateNumber(link, number);
  });

  ipcMain.on("delete-card", (event, link) => {
    const updatedСards = cardData.deleteItem(link);
    mainWindow.send("links", updatedСards);
  });
}

app.on("ready", main);
