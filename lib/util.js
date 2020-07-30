/**
 * 返回数组的第一个元素.
 */

exports.first = function (obj) {
  return obj[0];
};

/**
 * 返回数组的最后一个元素.
 */

exports.last = function (obj) {
  return obj[obj.length - 1];
};

/**
 * 返回首字母大写的字符串.
 */

exports.capitalize = function (str) {
  str = String(str);
  return str[0].toUpperCase() + str.substr(1, str.length);
};

/**
 * 返回字符串的小写.
 */

exports.downcase = function (str) {
  return String(str).toLowerCase();
};

/**
 * 返回字符串的大写.
 */

exports.upcase = function (str) {
  return String(str).toUpperCase();
};

/**
 * 排序.
 */

exports.sort = function (obj) {
  return Object.create(obj).sort();
};

/**
 * 按照指定的prop属性进行升序排序.
 */

exports.sort_by = function (obj, prop) {
  return Object.create(obj).sort(function (a, b) {
    a = a[prop], b = b[prop];
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
};

/**
 * 返回长度，即length属性，不一定非是数组才行.
 */

exports.size = exports.length = function (obj) {
  return obj.length;
};

/**
 * 加，将转化为Number进行运算.
 */

exports.plus = function (a, b) {
  return Number(a) + Number(b);
};

/**
 * 减，将转化为Number进行运算.
 */

exports.minus = function (a, b) {
  return Number(a) - Number(b);
};

/**
 * 乘，将转化为Number进行运算.
 */

exports.times = function (a, b) {
  return Number(a) * Number(b);
};

/**
 * 除，将转化为Number进行运算.
 */

exports.divided_by = function (a, b) {
  return Number(a) / Number(b);
};

/**
 * 将数组用'str'最为分隔符，进行合并成一个字符串.
 */

exports.join = function (obj, str) {
  return obj.join(str || ', ');
};

/**
 * 截取前len个字符，超过长度时，将返回一个副本.
 */

exports.truncate = function (str, len, append) {
  str = String(str);
  if (str.length > len) {
    str = str.slice(0, len);
    if (append) str += append;
  }
  return str;
};

/**
 * 取得字符串中的前n个word，word以空格进行分割.
 */

exports.truncate_words = function (str, n) {
  var str = String(str)
    , words = str.split(/ +/);
  return words.slice(0, n).join(' ');
};

/**
 * 字符串替换，substitution不提供将删除匹配的子串`.
 */

exports.replace = function (str, pattern, substitution) {
  return String(str).replace(pattern, substitution || '');
};

/**
 * 如果操作数为数组，则进行合并；为字符串则添加val在前面.
 */

exports.prepend = function (obj, val) {
  return Array.isArray(obj)
    ? [val].concat(obj)
    : val + obj;
};

/**
 * 如果操作数为数组，则进行合并；为字符串则添加val在后面.
 */

exports.append = function (obj, val) {
  return Array.isArray(obj)
    ? obj.concat(val)
    : obj + val;
};

/**
 * 返回对象数组中属性为prop的值组成的数组.
 */

exports.map = function (arr, prop) {
  return arr.map(function (obj) {
    return obj[prop];
  });
};

/**
 * 翻转数组或字符串.
 */

exports.reverse = function (obj) {
  return Array.isArray(obj)
    ? obj.reverse()
    : String(obj).split('').reverse().join('');
};

/**
 * 取得属性为'prop'的值.
 */

exports.get = function (obj, prop) {
  return obj[prop];
};

/**
 * 转化为json格式字符串.
 */
exports.json = function (obj) {
  return JSON.stringify(obj);
};
