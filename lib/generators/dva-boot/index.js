const BootGenerator = require('../../BootGenerator');

class MyGenerator extends BootGenerator {
  constructor(opts) {
    super(opts);
    this.registrys = [
      'https://github.com/LANIF-UI/dva-boot.git'
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
