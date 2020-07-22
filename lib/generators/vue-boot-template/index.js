const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const exec = require('execa');
const rimraf = require('rimraf');
const prettier = require('prettier');
const sortPackage = require('sort-package-json');
const filterPkg = require('./filterPkg');
const BasicGenerator = require('../../BasicGenerator');
const getFastGithub = require('../../getFastGithub');

function log(...args) {
  console.log(`${chalk.gray('>')}`, ...args);
}

class MyGenerator extends BasicGenerator {

}

module.exports = MyGenerator;
