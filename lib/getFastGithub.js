const fetch = require('node-fetch');

const registryMap = {
  'github.com': 'https://github.com/LANIF-UI/vue-boot-template.git',
  'gitee.com': 'https://gitee.com/wiqi/vue-boot-template.git',
};

/**
 * Get the fast registry Url(github.com or gitee.com)
 */
const getFastGithub = async () => {
  const promiseList = Object.keys(registryMap).map(async key => {
    return fetch(registryMap[key])
      .catch(() => null)
      .then(() => Promise.resolve(key));
  });
  try {
    const url = await Promise.race(promiseList);
    return url;
  } catch (e) {
    return 'github.com';
  }
};

module.exports = getFastGithub;
