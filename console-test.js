#!/usr/bin/env node
/**
 * name：      自定义仿console.log
 * function：  深度输出对象数据
 * author：    梁快升
 * department：无线公共支持touch FE
 */

//var str = myConsole.log(data,false);
//nodejs控制台输出：第一个参数为数据，第二个参数为是否格式化（可为空，默认为true）

//var str = myConsole.logFileAdd('elog2.txt',data,false);
//nodejs添加输出到文件
//var str = myConsole.logFileNew('elog2.txt',['1','xxx','asdsfds'],false);
//nodejs覆盖输出到文件
//第一个参数为文件路径，第二个参数为数据，第三个参数为是否格式化（可为空，默认为true）

//var str = myConsole.logHtml(data,true,false);
//浏览器 输出到Html：第一个参数为数据，第二个参数为是否格式化（可为空，默认为true），第三个参数为是否添加节点到html（可为空，默认为true）
//注意：若要设置第三个参数，则第二个参数必须显式设置


//注意：若在非node.js环境中使用，需要注释掉下面两句，否则会报错
var myConsole = require('./myConsole.js');       //node.js控制台输出
//var process = require('process');
// console.log( myConsole );
var str1 = myConsole.logFileNew('./elog2.txt',['1','xxx','asdsfds'],false);
var str2 = myConsole.logFileAdd('./elog2.txt',['1','xxx','asdsfds'],false);
// var str2 = myConsole.log(['1','xxx','asdsfds'],false);

process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val);
});