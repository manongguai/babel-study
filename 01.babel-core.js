/* 

@babel/core
主要作用：
主要负责代码的解析、转译、产生

demo验证：
期望结果：希望箭头函数可以转换成 es5 写法

*/

var babel = require("@babel/core");
var sourceCode = `[1,2,3].map(n=>n+2)`;

var options = {};

babel.transform(sourceCode, options, function (err, result) {
  console.log("result code: ", result.code);
  console.log("result========", result);

  /* 
  执行后：
结果：箭头函数经过转换没有变化，符合预期，因为在官网中有说到 @babel/core是核心，但是具体转译为哪个版本的 js，需要用户自己定义，在options中添加参数处理 */
});
