/* 
@babel-cli
主要作用：
@babel/cli 是允许使用命令行来编译文件，方便快捷
*/
var arr = [1, 2, 3].map((n) => n + 2);
const fn = () => console.log("hello babel");

/* 
使用终端命令执行本文件：

npx babel 03.babel-cli.js --out-file ./output/03.babel-cli.js-compiled.js

自动读取了本地babel.config.json,.babelrc 或 .babelrc.json 
*/
