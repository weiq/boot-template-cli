const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const exec = require('execa');
const rimraf = require('rimraf');
const prettier = require('prettier');
const sortPackage = require('sort-package-json');
const BasicGenerator = require('../../BasicGenerator');
const getFastGithub = require('../../getFastGithub');

const getGithubUrl = async () => {
  const fastGithub = await getFastGithub();
  if (fastGithub === 'gitee.com') {
    return 'https://gitee.com/wiqi/vue-boot-template.git';
  }
  return 'https://github.com/LANIF-UI/vue-boot-template';
};

function log(...args) {
  console.log(`${chalk.gray('>')}`, ...args);
}

class MyGenerator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'name',
        message: '⭐️ 请输入项目名称',
        default: this.name,
      },
      {
        name: 'description',
        message: '⭐️ 请输入项目描述',
      },
      {
        name: 'allBlocks',
        type: 'list',
        message: '⭐️ 你需要完整的示例，还是一个简单的脚手架',
        choices: ['simple', 'complete'],
        default: 'simple'
      }
    ];
    return this.prompt(prompts).then(props => {
      this.prompts = props;
    });
  }

  async writing() {
    const { name, description, allBlocks } = this.prompts;

    const projectName = name;
    const projectPath = path.resolve(this.opts.name || this.opts.env.cwd);
  }
}

module.exports = MyGenerator;
