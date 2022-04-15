const { BrowserWindow } = require("electron");

const defaultProps = {
  width: 1200,
  height: 900,
  minWidth: 900,
  minHeight: 900,
  icon: __dirname + "/icon.ico",
  show: false,
  webPreferences: {
    nodeIntegration: true,
  },
};

class Window extends BrowserWindow {
  constructor({ file, ...windowSettings }) {
    super({ ...defaultProps, ...windowSettings });
    this.loadFile(file);
    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

module.exports = Window;
