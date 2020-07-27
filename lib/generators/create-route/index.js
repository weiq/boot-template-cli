const fs = require('fs-extra');
const { basename } = require('path');
const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  constructor(opts) {
    super(opts);
    this.opts = opts;
    this.name = basename(opts.env.cwd);

    this.routes = [];
    if (fs.existsSync(`${this.opts.env.cwd}/templates/routes`)) {
      this.routes = fs
        .readdirSync(`${this.opts.env.cwd}/templates/routes`)
        .filter((f) => fs.statSync(`${this.opts.env.cwd}/templates/routes/${f}`).isDirectory());
    }

    if (!this.routes.length) {
      console.log('\n');
      console.log('>', chalk.red(`工程所在目录没有找到路由模板`));
      process.exit(1);
    }
  }

  prompting() {
    const prompts = [
      {
        name: 'type',
        type: 'list',
        message: '⭐️ 选择一种路由类型',
        choices: this.routes,
        default: 'simple',
      },
      {
        name: 'name',
        message: `⭐️ 路由页名称(name)`,
      },
      {
        name: 'title',
        message: `⭐️ 路由页标题(title)`,
      },
    ];
    return this.prompt(prompts).then((props) => {
      this.prompts = props;
    });
  }

  writing() {
    const { type, name, title } = this.prompts;

    this.writeFiles({
      context: {
        name: this.name,
        ...this.prompts,
      },
      sourcePath: this.destinationPath('templates', 'routes', type),
      descPath: this.destinationPath('tests')
    });
  }
}

module.exports = Generator;
