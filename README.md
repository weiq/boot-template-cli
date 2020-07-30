# boot-template-cli
VUE &amp; React template generator cli

## 说明

```bash
// 安装
$ npm install boot-template-cli -g

// 运行
$ create-template

// 开发调试
$ npm link
```

## 配置（可选）

pacage.json
```json
...
"create-template": {
  "ignoreScript": [
    // 生成后忽略script里的一些项
  ],
  "ignoreDevDependencies": [
    // 生成后忽略devDependencies里的一些项
  ],
  "ignore": [
    // 生成后忽略跟目录下的一些文件
  ],
  "route": {
    // 运行create-route用到的配置
    "nameCase": "pascal", // 路由文件名使用大写驼峰样式,默认使用输入的值
    "importStyle": "func"  // 路由引入时采用函数式，如Blank(app)，默认为Blank
  }
},
...

```

在templates（模板）路由页下新建`prompts.json`文件，可附加额外的交互信息 [Inquirer](https://github.com/SBoudrias/Inquirer.js)，之后在模板的ejs表棕式中可使用这些变量。

prompts.json
```json
[
  {
    "name": "api_0",
    "message": "⭐️ 列表查询接口"
  },
  {
    "name": "api_1",
    "message": "⭐️ 保存接口"
  },
  {
    "name": "api_2",
    "message": "⭐️ 删除接口"
  }
]

```
## 使用

### 1.选择模板 dva-boot | dva-boot-admin | vue-boot-template

> 暂时支持下载并使用这三种脚手架生成我们的工程 

### 2.创建路由页 create-route

> 模板创建基于我们工程下的templates文件夹下的内容，模板页使用ejs语法，可以灵活自定义我们的模板，
可以把我们的典型业务场景提取出来放到templates下做成模板



