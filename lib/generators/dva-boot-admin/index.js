const BootGenerator = require('../../BootGenerator');

class MyGenerator extends BootGenerator {
  constructor(opts) {
    super(opts);
    this.registrys = [
      'https://gitee.com/wiqi/dva-boot-admin.git',
      'https://github.com/LANIF-UI/dva-boot-admin.git'
    ];
  }

  prompting() {
    return this._prompting();
  }

  async writing() {
    await this._writing();
  }
}

module.exports = MyGenerator;
