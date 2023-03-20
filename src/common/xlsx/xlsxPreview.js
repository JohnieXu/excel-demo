import * as xlsx from "xlsx";
import canvasDatagrid from "canvas-datagrid";
import Handsontable from "handsontable";
import { log } from "./log";

// TODO: 需处理副作用
import "handsontable/dist/handsontable.full.min.css";

export const RENDER_TYPE = {
  grid: "grid", // canvasDatagrid
  hot: "hot" // handsontable
};

/**
 * Excel 文件预览
 * 使用方法: new XlsxPreview().init(buffer, el, style)
 * 切换表格 sheet: xlsxPreview.showSheet(sheetName)
 * _ 开头的方法约定为类私有方法
 */
export default class XlsxPreview {
  constructor({ renderType = XlsxPreview.RENDER_TYPE.grid } = {}) {
    this._renderType = renderType;
  }
  static RENDER_TYPE = {
    grid: "grid", // canvasDatagrid
    hot: "hot" // handsontable
  };
  _workbook = null;
  _grid = null;
  _hot = null;
  _renderType = XlsxPreview.RENDER_TYPE.grid;
  _removeChild(el) {
    if (el) {
      this._debug("开始清除之前生成的DOM节点");
      el.firstElementChild && el.removeChild(el.firstElementChild);
    }
  }
  _initGrid(style, ...args) {
    this._removeChild(args[0] && args[0].parentNode);
    this._debug("init with options", ...args);
    // canvasDatagrid会在当前 element 下放插入新的 element
    this._grid = canvasDatagrid(...args);
    if (style) {
      this._grid.style.width = style.width || "100%";
      this._grid.style.height = style.height || "100%";
    }
  }
  _initTable(style, ...args) {
    const el = (args[0] || {}).parentNode;
    this._removeChild(args[0] && el);
    this._debug("init with options", ...args);

    // handsontable会将当前 element 直接替换
    const child = document.createElement("div");
    el.appendChild(child);

    this._hot = new Handsontable(child, {
      rowHeaders: true,
      colHeaders: true,
      readOnly: true,
      width: style && style.width ? style.width : "auto",
      height: style && style.height ? style.height : "auto",
      licenseKey: "non-commercial-and-evaluation" // for non-commercial use only
    });
  }
  _sheet2Json(sheet) {
    this._debug("开始转换sheet数据");
    return xlsx.utils.sheet_to_json(sheet);
  }
  _updateGridData(data) {
    if (this._renderType === XlsxPreview.RENDER_TYPE.hot) {
      if (!this._hot) {
        throw new Error("grid not initialized");
      }
      this._debug("开始更新grid.data");
      this._hot.updateData(data);
    } else {
      if (!this._grid) {
        throw new Error("grid not initialized");
      }
      this._debug("开始更新grid.data");
      this._grid.data = data;
    }
  }
  _debug(...args) {
    log.log(...args);
  }
  init(buffer, el, style, ...gridOptions) {
    this._debug("表格渲染类型为 " + this._renderType);
    if (this._renderType === XlsxPreview.RENDER_TYPE.hot) {
      this._initTable(style, {
        parentNode: el,
        editable: false,
        ...gridOptions[0]
      });
    } else {
      this._initGrid(style, {
        parentNode: el,
        editable: false,
        ...gridOptions[0]
      });
    }
    this._debug("开始解析字节流为workbook");
    const wb = xlsx.read(buffer);

    this._workbook = wb;

    this.showSheet();
  }
  setRenderType(renderType) {
    if (!Object.keys(XlsxPreview.RENDER_TYPE).includes(renderType)) {
      throw new Error(
        `renderType should be one of [${Object.keys(
          XlsxPreview.RENDER_TYPE
        ).join(", ")}], but got ${renderType}`
      );
    }
    if (this._renderType === XlsxPreview.RENDER_TYPE.hot && this._hot) {
      throw new Error("can't change renderType after init");
    }
    if (this._renderType === XlsxPreview.RENDER_TYPE.grid && this._grid) {
      throw new Error("can't change renderType after init");
    }
    this._debug("切换表格渲染类型为 " + renderType);
    this._renderType = renderType;
  }
  /**
   * 获取 excel 文件的 sheet 名称
   * @returns {Object}
   */
  getSheetNames() {
    if (!this._workbook) {
      throw new Error("workbook not initialized");
    }
    return JSON.parse(JSON.stringify(this._workbook.SheetNames));
  }
  /**
   * 切换展示对应 sheet 数据
   * @param {string} sheetName sheet 名称
   * TODO: 切换 sheet 添加加载中效果
   */
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
    // FIXME: handsontable 切换 sheet 数据时主线程会卡顿
    this._updateGridData(this._sheet2Json(sheet));
  }
}
