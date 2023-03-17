import * as xlsx from "xlsx";
import canvasDatagrid from "canvas-datagrid";
import { log } from "./log";

export default class XlsxPreview {
  _workbook = null;
  _grid = null;
  _removeChild(el) {
    if (el) {
      this._debug("开始清除之前生成的DOM节点");
      el.firstElementChild && el.removeChild(el.firstElementChild);
    }
  }
  _initGrid(style, ...args) {
    this._removeChild(args[0] && args[0].parentNode);
    this._debug("init with options", ...args);
    this._grid = canvasDatagrid(...args);
    if (style) {
      this._grid.style.width = style.width || "100%";
      this._grid.style.height = style.height || "100%";
    }
  }
  init(buffer, el, style, ...gridOptions) {
    this._initGrid(style, { parentNode: el, editable: false, ...gridOptions[0] });
    this._debug("开始解析字节流为workbook");
    const wb = xlsx.read(buffer);

    this._workbook = wb;

    this.showSheet();
  }
  getSheetNames() {
    if (!this._workbook) {
      throw new Error("workbook not initialized");
    }
    return JSON.parse(JSON.stringify(this._workbook.SheetNames));
  }
  showSheet(sheetName) {
    if (!this._workbook) {
      throw new Error("workbook not initialized");
    }
    const SheetNames = this._workbook.SheetNames;
    this._debug(
      "开始展示sheet：" + (sheetName || this._workbook.SheetNames[0])
    );
    let sheet = null;
    if (!sheetName) {
      sheet = this._workbook.Sheets[SheetNames[0]];
    } else if (!this._workbook.Sheets[sheetName]) {
      throw new Error("sheet not found");
    } else {
      sheet = this._workbook.Sheets[sheetName];
    }
    this._updateGridData(this._sheet2Json(sheet));
  }
  _sheet2Json(sheet) {
    this._debug("开始转换sheet数据");
    return xlsx.utils.sheet_to_json(sheet);
  }
  _updateGridData(data) {
    if (!this._grid) {
      throw new Error("grid not initialized");
    }
    this._debug("开始更新grid.data");
    this._grid.data = data;
  }
  _debug(...args) {
    log.log(...args);
  }
}
