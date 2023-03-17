export default class FilePool {
  _files = [
    "./files/上海招行开发列表.xls",
    "./files/北京农行开发计划.xls",
    "./files/平安银行开发计划.xls",
    "./files/恒丰合伙人二期改造计划.xlsx",
    "./files/恒丰合伙人二期改造计划(黄成).xlsx",
    "./files/营销平台版本需求开发计划2.xlsx",
    "./files/工行信用卡权益车商户清单文件.xls"
  ];
  _index = -1;

  random() {
    let index = this._index;
    if (++index > this._files.length) {
      this._index = 0;
    } else {
      this._index = index;
    }
    return this._files[index] ? this._files[index] : this.random();
  }

  last() {
    return this._files[this._files.length - 1];
  }

  one(index) {
    return this._files[index] ? this._files[index] : null;
  }

  getInstance() {}
}
