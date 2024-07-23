/* 
@babel/polyfill
主要作用：
对于比较新的 js 内置函数，可以进行转译
*/

const array = [1, 2, 3, 4];

array.includes(2);

/* 
 不使用@babel/polyfill的时候以上代码只会转换一个const]
    "use strict";

    var array = [1, 2, 3, 4];
    array.includes(2);
    
 使用@babel/polyfill，则会引入一个 core-js/modules/es7.array.includes.js 
 ，直接在对象的构造函数或者原型上添加方法，会出现污染全局变量，因此有 @babel/plugin-transform-runtime 插件出现解决此问题

  执行结果：
   import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
   var array = [1, 2, 3, 4];
   _includesInstanceProperty(array).call(array, 2);
*/
