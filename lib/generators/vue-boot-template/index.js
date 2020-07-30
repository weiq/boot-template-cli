const BootGenerator = require('../../BootGenerator');

class MyGenerator extends BootGenerator {
  constructor(opts) {
    super(opts);
    this.registrys = [
      'https://gitee.com/wiqi/vue-boot-template.git',
      'https://github.com/LANIF-UI/vue-boot-template.git'
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
