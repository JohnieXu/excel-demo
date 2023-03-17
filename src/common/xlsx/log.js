export default class Log {
  constructor(module) {
    if (module) {
      this._module = module
    }
    if (window.__debug || process.env.VUE_APP_DEBUG === "1" || process.env.NODE_ENV === "development") {
      this._isShowLog = true
    }
  }
  _module = ''
  _isShowLog = false
  log(...args) {
    if (!this._isShowLog) { return }
    if (this._module) {
      console.log(this._module, ...args);
    } else {
      console.log(...args);
    }
  }
};

export const log = new Log();
