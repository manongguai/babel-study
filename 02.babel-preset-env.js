/* 

@babel/preset-env
主要作用：
可以根据配置的目标浏览器或者运行环境来自动将 ES5+的代码转换为 ES5

@babel/preset-env的配置参数：
1.1、 targets:
支持的浏览器

1.2、useBuiltIns:
useBuiltIns项取值可以是"usage" 、 “entry” 或 false(默认)。和polyfill的行为有关系。

1） false:
默认值，不处理api。

2）entry:
全部引入polyfill，需要在入口文件引入 polyfill。如何引用由 corejs 版本决定，详情查看 3. corejs 参数介绍。

3）usage:
按需引入polyfill，不用引入@babel/polyfill。

Babel 编译通常会排除 node_modules，所以 “useBuiltIns”: “usage” 存在风险，可能无法为依赖包添加必要的 polyfill。

1.3、 corejs：
取值为2(默认)和3，只在useBuiltIns: "entry | usage"时有效。

需要注意的是：
1) corejs取值为2
如果安装了 @babel/polyfill 不用在额外安装 core-js@2，因为 @babel/polyfill 模块包含 core-js 和一个自定义的 regenerator runtime 。
2) corejs取值为3
必须安装core-js@3版本才可以，否则Babel会转换失败并提示：
@babel/polyfill is deprecated. Please, use required parts of core-js and regenerator-runtime/runtime separately
1.4、 modules:
该项用来设置是否把ES6的模块化语法改成其它模块化语法。
取值为：“amd”、“umd” 、 “systemjs” 、 “commonjs” 、“cjs” 、“auto” (默认)、false。
默认代码里import都被转码成require。

如果我们将参数项改成false，那么就不会对ES6模块化进行更改，还是使用import引入模块。

使用ES6模块化语法有什么好处呢？
在使用Webpack一类的打包工具，可以进行静态分析，从而可以做tree shaking等优化措施。
————————————————

上面配置方式的问题有哪些？
1）全局污染问题
babel 的 polyfill 机制是，对于例如 Array.from 等静态方法，直接在 global.Array 上添加；对于例如 includes 等实例方法，直接在 global.Array.prototype 上添加。这样直接修改了全局变量的原型，有可能会带来意想不到的问题。

2）代码重复
代码在编译的过程中会使用一些 helper (辅助函数)，会直接写在文件中，如果多个文件都是用了相同的语法，那个两个文件中都会有这个语法对应的 helper 。这种代码重复会造成文件尺寸增大。

那么如何来解决上面的两个问题呢？答案就是使用插件

@babel/runtime-corejs3
@babel/plugin-transform-runtime
删除内联 helper，运行时从 @babel/runtime-corejs3/helpers 模块中引入 helper，避免全局污染同时减少文件尺寸。

2、使用@babel/plugin-transform-runtime和@babel/runtime-corejs3

@babel/runtime-corejs3
@babel/runtime-corejs3/helpers 模块下的保存着 Babel 编译所需要的各种 helper，不再将 helper 内联到各个文件中去，直接从 @babel/runtime-corejs3/helpers 模块中入即可。

@babel/plugin-transform-runtime
删除内联 helper，从 @babel/runtime-corejs3/helpers 模块中引入 helper。
用法：

{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": ">0.2%, not dead, Firefox >= 52, IE >= 8"
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": "3",
        "helpers": true,
        "regenerator": true
      }
    ]
  ]
}
2.1、@babel/plugin-transform-runtime 配置参数说明

1）corejs

2 | 3 | false(默认)。
指向选项的值为数字，即选择哪个版本的@babel-runtime-corejs:

配置corejs为3，需要预先安装@babel/runtime-corejs3
配置corejs为2，需要预先安装@babel/runtime-corejs2
配置corejs为false，需要预先安装@babel/runtime
2）helpers
true(默认) | false

从 @babel/runtime-corejs/helpers 模块中引入 helper。代替内联 helper。

3）regenerator
true(默认) | false

切换是否将generator函数转换为使用不污染全局作用的regenerator运行时。


在Babel7之前的版本中，对于未发布的特性也可以设置预设，但是，Babel7中已经不在支持。
stage0 只是一个想法，有 Babel 插件实现了对这些特性的支持，但是不确定是否会被定为标准；
stage1 值得被纳入标准的特性；
stage2 该特性规范已经被起草，将会被纳入标准里；
stage3 该特性规范已经定稿，各大浏览器厂商和 Node.js 社区开始着手实现；
stage4 在接下来的一年将会加入到标准里去。

*/

var babel = require("@babel/core");
var sourceCode = `[1,2,3].map(n=>n+2)`;

var options = {
  presets: ["@babel/env"],
};

babel.transform(sourceCode, options, function (err, result) {
  console.log("result code: ", result.code);
  console.log("result========", result);

  /* 
  结果符合预期，成功 ES6 转换成 ES5
  当做到这一步的时候，有一点比较好奇，既然说了是根据配置的目标浏览器或者运行环境来确定的，那上面的配置中没有设置目标浏览器, 是怎么确定的？是有默认配置么？默认配置是什么？

  上面的疑问均可在 @babel/preset-env 的 How Does it work https://babeljs.io/docs/en/babel-preset-env#how-does-it-work 中找到，babel 是通过 browserslist 来设置默认的环境版本的，其中在 browserlist 的 Queries 中提到了版本获取方法，第五条是默认版本，如下描述：

    If the above methods did not produce a valid result Browserslist will use defaults: > 0.5%, last 2 versions, Firefox ESR, not dead（代表全球超过 0.5% 的人在使用的浏览器，支持各个浏览器的最近两个版本，火狐浏览器的最新版本，最新的两个版本中发现其市场份额已经大于 0.5% 并且 24 个月内有任务官方支持和更新了）
    .browserslistrc
        > 0.25%
        not dead
    or
    package.json
    { "browserslist": "> 0.25%, not dead" }
  */
});
