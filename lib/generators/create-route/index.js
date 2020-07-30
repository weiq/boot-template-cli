const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');
const util = require('../../util');

class Generator extends BasicGenerator {
  constructor(opts) {
    super(opts);
    this.opts = opts;
    this.name = path.basename(opts.env.cwd);

    this.routes = [];
    this.extraPrompts = [];
    if (fs.existsSync(`${this.opts.env.cwd}/templates/routes`)) {
      this.routes = fs
        .readdirSync(`${this.opts.env.cwd}/templates/routes`)
        .filter((f) => fs.statSync(`${this.opts.env.cwd}/templates/routes/${f}`).isDirectory());

      this.routes.forEach(route => {
        if (fs.existsSync(`${this.opts.env.cwd}/templates/routes/${route}/prompts.json`)) {
          this.extraPrompts = require(`${this.opts.env.cwd}/templates/routes/${route}/prompts.json`) || [];
          this.extraPrompts = this.extraPrompts.map(prompt => ({
            ...prompt,
            "when": ({ type }) => {
              return type === route;
            }
          }))
        }
      })
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
      ...this.extraPrompts
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

    let fileName = name.toLowerCase();
    const packageJsonPath = path.resolve(this.opts.env.cwd, 'package.json');
    const pkg = require(packageJsonPath);
    const { nameCase, importStyle } = pkg['create-template'].route || {};
    if (nameCase === 'pascal') {
      fileName = util.capitalize(name);
    }

    // 注册路由
    const routersPath = this.destinationPath('src', 'routes', 'index.js');
    this.fs.write(
      routersPath,
      this.fs
        .read(routersPath)
        .replace('/* <import></import> */', [
          `import ${util.capitalize(name)} from '@/routes/${fileName}'`,
          '/* <import></import> */'
        ].join('\n'))
        .replace('/* <router></router> */', [
          '/* <router></router> */',
          `  ${util.capitalize(name) + (importStyle === 'func' ? '(app)' : '')},`
        ].join('\n'))
    );

    // 复制文件
    this.writeFiles({
      context: {
        name: this.name,
        ...this.prompts,
        ...util
      },
      filterFiles: f => f.indexOf('prompts.json') === -1,
      sourcePath: this.destinationPath('templates', 'routes', type),
      descPath: this.destinationPath('src', 'routes', fileName)
    });
  }
}

module.exports = Generator;
