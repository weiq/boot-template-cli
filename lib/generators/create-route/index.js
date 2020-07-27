const fs = require('fs-extra');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  prompting() {
    const routes = fs
      .readdirSync(`${this.opts.env.cwd}/templates/routes`)
      .filter(f => fs.statSync(`${this.opts.env.cwd}/templates/routes/${f}`).isDirectory())

    const prompts = [
      {
        name: 'type',
        type: 'list',
        message: '⭐️ 选择一种路由类型',
        choices: routes,
        default: 'simple'
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
    return this.prompt(prompts).then(props => {
      this.prompts = props;
    });
  }

  writing() {

  }
}

module.exports = Generator;
