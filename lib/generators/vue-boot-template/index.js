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

function globList(patternList, options) {
  let fileList = [];
  patternList.forEach(pattern => {
    fileList = [...fileList, ...glob.sync(pattern, options)];
  });

  return fileList;
}

function filterPkg(pkgObject, ignoreList) {
  const devObj = {};
  Object.keys(pkgObject).forEach(key => {
    const isIgnore = ignoreList.some(reg => {
      return new RegExp(reg).test(key);
    });
    if (isIgnore) {
      return;
    }
    devObj[key] = pkgObject[key];
  });
  return devObj;
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
      },
      {
        name: 'yarnOrNpm',
        type: 'list',
        message: '⭐️ 你的包管理工具',
        choices: ['npm', 'yarn', 'custom']
      },
    ];
    return this.prompt(prompts).then(props => {
      this.prompts = props;
    });
  }

  async writing() {
    const { name, description, allBlocks, yarnOrNpm } = this.prompts;

    const projectName = this.opts.name || this.opts.env.cwd;
    const projectPath = path.resolve(projectName);

    const envOptions = {
      cwd: projectPath,
    };

    const githubUrl = await getGithubUrl();
    const gitArgs = [`clone`, githubUrl, `--depth=1`];

    // all-blocks 分支上包含了所有的区块
    if (allBlocks === 'complete') {
      gitArgs.push('--branch', 'all-blocks');
    }

    gitArgs.push(projectName);

    // // 没有提供关闭的配置
    // // https://github.com/yeoman/environment/blob/9880bc7d5b26beff9f0b4d5048c672a85ce4bcaa/lib/util/repository.js#L50
    const yoConfigPth = path.join(projectPath, '.yo-repository');
    if (fs.existsSync(yoConfigPth)) {
      // 删除 .yo-repository
      rimraf.sync(yoConfigPth);
    }

    if (
      fs.existsSync(projectPath) &&
      fs.statSync(projectPath).isDirectory() &&
      fs.readdirSync(projectPath).length > 0
    ) {
      console.log('\n');
      console.log(`工程所在目录不为空`);
      process.exit(1);
    }

    await exec(
      `git`,
      gitArgs,
      process.env.TEST
        ? {}
        : {
          stdout: process.stdout,
          stderr: process.stderr,
          stdin: process.stdin,
        },
    );

    log(`🚚 clone success`);

    const packageJsonPath = path.resolve(projectPath, 'package.json');
    const pkg = require(packageJsonPath);
    pkg.version = '1.0.0';
    pkg.name = name || this.name;
    // gen package.json
    if (description) {
      pkg.description = description;
    }
    if (pkg['create-template']) {
      const { ignoreScript = [], ignoreDevDependencies = [] } = pkg['create-template'];
      // filter scripts and devDependencies
      const projectPkg = {
        ...pkg,
        scripts: filterPkg(pkg.scripts, ignoreScript),
        devDependencies: filterPkg(pkg.devDependencies, ignoreDevDependencies),
      };

      delete projectPkg['create-template'];

      fs.writeFileSync(
        path.resolve(projectPath, 'package.json'),
        // 删除一个包之后 json会多了一些空行。sortPackage 可以删除掉并且排序
        // prettier 会容忍一个空行
        prettier.format(JSON.stringify(sortPackage(projectPkg)), {
          parser: 'json',
        }),
      );
    }

    // Clean up useless files
    if (pkg['create-template'] && pkg['create-template'].ignore) {
      log('Clean up...');
      const ignoreFiles = pkg['create-template'].ignore;
      const fileList = globList(ignoreFiles, envOptions);

      fileList.forEach(filePath => {
        const targetPath = path.resolve(projectPath, filePath);
        fs.removeSync(targetPath);
      });
    }

    const installCommand = []
    if (yarnOrNpm === 'npm') {
      installCommand.push('install');
    }

    if (yarnOrNpm === 'npm' || yarnOrNpm === 'yarn') {
      await exec(
        yarnOrNpm,
        installCommand,
        process.env.TEST
          ? {}
          : {
            stdout: process.stdout,
            stderr: process.stderr,
            stdin: process.stdin,
          },
      );
    }

    console.log(`成功创建工程 ${pkg.name}`);
    console.log(`使用下面的命令来启动程序: \n`);
    if (yarnOrNpm === 'npm') {
      console.log(' $', chalk.green('npm start'));
    } else if (yarnOrNpm === 'yarn') {
      console.log(' $', chalk.green('yarn start'));
    } else {
      console.log(' $', chalk.green('npm install 或 yarn'));
      console.log(' $', chalk.green('npm start 或 yarn start'));
    }
  }
}

module.exports = MyGenerator;
