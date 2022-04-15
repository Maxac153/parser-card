const xlsx = require("xlsx");
const path = require("path");

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

const exportUsersToExcel = (
  cards,
  workSheetColumnNames,
  workSheetName,
  filePath,
  rateCard
) => {
  let data = [];
  for (let i = 0; i < cards.links.length; i++) {
    data.push([
      cards.number[i],
      cards.cardName[i],
      Math.ceil(cards.price[i] * rateCard),
      cards.price[i].replace(".", ","),
      cards.outOfStock[i],
      cards.Set[i],
      cards.mode[i],
      cards.foil[i],
      cards.links[i],
    ]);
  }
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

module.exports = exportUsersToExcel;
