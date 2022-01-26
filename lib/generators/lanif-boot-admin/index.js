const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const exec = require('execa');
const glob = require('glob');
const BasicGenerator = require('../../BasicGenerator');
const util = require('../../util');
const getFastGithub = require('../../getFastGithub');

function log(...args) {
  console.log(`${chalk.gray('>')}`, ...args);
}

const getGithubUrl = async (urls) => {
  const fastGithub = await getFastGithub(urls);
  if (!fastGithub) {
    log(`请求模板地址异常`);
    process.exit(1);
  }
  return fastGithub;
};

function globList(patternList, options) {
  let fileList = [];
  patternList.forEach((pattern) => {
    fileList = [...fileList, ...glob.sync(pattern, options)];
  });

  return fileList;
}

class Generator extends BasicGenerator {
  constructor(opts) {
    super(opts);
    this.opts = opts;
    this.name = path.basename(opts.env.cwd);
    this.registrys = ['https://gitee.com/jtqf/lanif-boot-admin.git'];
  }

  prompting() {
    const prompts = [
      {
        name: 'directory',
        message: '⭐️ 请输入文件夹名称',
        default: 'lanif-boot-admin',
      },
      {
        name: 'serverName',
        message: '⭐️ 请输入服务端工程名称',
        default: 'lanif-server',
      },
      {
        name: 'frontName',
        message: '⭐️ 请输入前端工程名称',
        default: 'lanif-ui',
      },
      {
        name: 'hasUI',
        type: 'list',
        message: '⭐️ 是否需要前端工程',
        choices: ['yes', 'no'],
        default: 'yes',
      },
    ];
    return this.prompt(prompts).then((props) => {
      this.prompts = props;
    });
  }

  async writing() {
    const { directory, serverName, frontName, hasUI } = this.prompts;
    if (!directory) {
      log('\n');
      log('>', chalk.red(`目录名称(directory)不能为空，不允许使特殊字符等`));
      process.exit(1);
    }

    const projectName = path.join(this.opts.name || this.opts.env.cwd, directory);
    const projectPath = path.resolve(projectName);

    // 获取项目地址
    const githubUrl = await getGithubUrl(this.registrys);
    const gitArgs = [`clone`, githubUrl, `--depth=1`, projectName];

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
      log('\n');
      log(`工程所在目录不为空`);
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

    log(`🚚 项目clone成功`);

    // 清理文件
    const envOptions = {
      cwd: projectPath,
    };
    const ignoreFiles = ['.git'];
    const fileList = globList(ignoreFiles, envOptions);

    fileList.forEach((filePath) => {
      const targetPath = path.resolve(projectPath, filePath);
      fs.removeSync(targetPath);
    });
    log('清理临时文件');

    // 修改项目名称
    if (serverName !== 'lanif-server') {
      log('服务端项目重命名');
      const _old = path.resolve(projectPath, 'lanif-server');
      const _new = path.resolve(projectPath, serverName);
      fs.renameSync(_old, _new);

      const pom1 = this.destinationPath(directory, serverName, 'pom.xml');
      fs.writeFileSync(pom1, fs.readFileSync(pom1, 'utf8').replace(/lanif-server/g, serverName));
      const pom2 = this.destinationPath(directory, serverName, 'lanif-base-support', 'pom.xml');
      fs.writeFileSync(pom2, fs.readFileSync(pom2, 'utf8').replace(/lanif-server/g, serverName));
      const pom3 = this.destinationPath(directory, serverName, 'lanif-main', 'pom.xml');
      fs.writeFileSync(pom3, fs.readFileSync(pom3, 'utf8').replace(/lanif-server/g, serverName));
      const sql = this.destinationPath(directory, serverName, '_sql', 'base.sql');
      fs.writeFileSync(sql, fs.readFileSync(sql, 'utf8').replace(/lanif-server/g, serverName));
      const dev = this.destinationPath(
        directory,
        serverName,
        'lanif-main',
        'src',
        'main',
        'resources',
        'application-dev.yml',
      );
      fs.writeFileSync(dev, fs.readFileSync(dev, 'utf8').replace(/lanif-server/g, serverName));
      const local = this.destinationPath(
        directory,
        serverName,
        'lanif-main',
        'src',
        'main',
        'resources',
        'application-local.yml',
      );
      fs.writeFileSync(local, fs.readFileSync(local, 'utf8').replace(/lanif-server/g, serverName));
      const prod = this.destinationPath(
        directory,
        serverName,
        'lanif-main',
        'src',
        'main',
        'resources',
        'application-prod.yml',
      );
      fs.writeFileSync(prod, fs.readFileSync(prod, 'utf8').replace(/lanif-server/g, serverName));
    }

    if (hasUI === 'no') {
      log('删除前端项目');
      const _path = path.resolve(projectPath, 'lanif-ui');
      fs.removeSync(_path);
    }

    if (hasUI === 'yes' && frontName !== 'lanif-ui') {
      log('前端项目重命名');
      const _old = path.resolve(projectPath, 'lanif-ui');
      const _new = path.resolve(projectPath, frontName);
      console.log(_new, _old)
      fs.rename(_old, _new);
    }

    log(`成功创建项目 ${directory}`);
  }
}

module.exports = Generator;
