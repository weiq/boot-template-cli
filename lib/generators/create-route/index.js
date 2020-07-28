const fs = require('fs-extra');
const { basename } = require('path');
const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');
const util = require('../../util');

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
        desc: '使用小写字母不要使用特殊字符'
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
    const { type, name } = this.prompts;

    if (!name) {
      console.log('\n');
      console.log('>', chalk.red(`路由页名称(name)不能为空，不允许使特殊字符等`));
      process.exit(1);
    }

    // 注册路由
    const routersPath = this.destinationPath('src', 'routers', 'index.js');
    this.fs.write(
      routersPath,
      this.fs
        .read(routersPath)
        .replace('/* <import></import> */', [
          `import ${util.capitalize(name)} from '@/routers/${name}'`,
          '/* <import></import> */'
        ].join('\n'))
        .replace('/* <router></router> */', [
          '/* <router></router> */',
          `  ${util.capitalize(name)},`
        ].join('\n'))
    );

    // 复制文件
    this.writeFiles({
      context: {
        name: this.name,
        ...this.prompts,
        ...util
      },
      sourcePath: this.destinationPath('templates', 'routes', type),
      descPath: this.destinationPath('src', 'routers', name.toLowerCase())
    });
  }
}

module.exports = Generator;
