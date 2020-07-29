const fetch = require('node-fetch');

const registrys = [
  'https://github.com/LANIF-UI/vue-boot-template.git',
  'https://gitee.com/wiqi/vue-boot-template.git',
];

/**
 * Get the fast registry Url(github.com or gitee.com)
 */
const getFastGithub = async (urls = registrys) => {
  const promiseList = urls.map(async key => {
    return fetch(key)
      .catch(() => null)
      .then(() => Promise.resolve(key));
  });
  try {
    const url = await Promise.race(promiseList);
    return url;
  } catch (e) {
    return null;
  }
};

module.exports = getFastGithub;
