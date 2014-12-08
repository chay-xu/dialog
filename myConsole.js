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
var fs = require('fs');         //node.js文件输出
var sys = require('sys');       //node.js控制台输出

var myConsole = function() {};
myConsole.prototype = {
    log:  Log,                  //nodejs控制台输出
    logFileAdd:  LogFileAdd,    //nodejs添加输出到文件
    logFileNew:  LogFileNew,    //nodejs覆盖输出到文件
    logHtml:  LogHtml           //浏览器 输出到Html
}

//配置项
var nextLine = '\r\n';//换行符号
var tabChar = '    ';//缩进符号
var _out_str = '';//缓存字符串


//全部组装完成后一起输出
//输出或者拼接
var output = function (obj){
    _out_str += obj;
};
//拼接要输出的字符串
function getOutStr(obj,isFormate){//isFormate是否缩进
    _out_str = '';
    mylog(obj,1,isFormate);
    printLn(true);
}
//添加输出到文件
function LogFileAdd(file,obj,isFormate){
    getOutStr(obj,isFormate);
    saveFile(file,'a',_out_str);
    return _out_str;
}
//覆盖输出到文件
function LogFileNew(file,obj,isFormate){
    getOutStr(obj,isFormate);
    saveFile(file,'n',_out_str);
    return _out_str;
}
//控制台输出
function Log(obj,isFormate){
    getOutStr(obj,isFormate);
    sys.print(_out_str);
    return _out_str;
}
//html输出
function LogHtml(obj,isFormate,isAddPre){//isAddPre是否添加到html，默认添加
    getOutStr(obj,isFormate);
    if(isAddPre == null)isAddPre = true;
    if(isAddPre){
        var pre=document.createElement(pre);
        pre.className = 'log-disp-pre';
        var node=document.createTextNode(_out_str);
        pre.appendChild(node);
        document.body.appendChild(pre);
         $('body').append('pre class=log-disp-pre'+ _out_str + 'pre');
    }
    return _out_str;
}
//写入文件
//type = 'a'为添加，'n'为覆盖

var saveFile = function (file,type,content){
    switch(type){
        case 'a':{
            fs.appendFile(file, content, function (err) {
                if (err) throw err;
                console.log(file + ':It\'s saved append!'); //文件被保存
            });
            break;
        }
        case 'n':{
            fs.writeFile(file, content, function (err) {
                if (err) throw err;
                console.log(file + ':It\'s saved new!'); //文件被保存
            });
            break;
        }
    }
};


//不进行组装，一个个输出
/*
 var output = function (obj){
     sys.print(obj);
      console.log(obj);
      process.stdout.write(obj);
 };
 function Log(obj,isFormate){
     mylog(obj,1,isFormate);
     printLn(true);
 }
*/
//处理数据
function mylog(obj,deep,isFormate){
    if(!deep)deep=1;
    switch(dataType(obj)){
        case 1:{
            output('');
            output(obj);
            output('');
            break;
        }
         case 2:{
             break;
         }
        case 3:{
            output('');
            output(obj.toString());
            output('');
            break;
        }
        case 4:{
            output(obj);
             if(obj){output(true);}else{output(false);}
            break;
        }
         case 5:{
             break;
         }
        case 6:{
            output('{');
            printLn(isFormate);
            var num1 = 0,num2 = 0;
            for(var key in obj){num1++;}
            for(var key in obj){
                printSpace(deep,isFormate);
                output(key);
                output('');
                printStr(' ',isFormate);
                mylog(obj[key],deep+1,isFormate);
                num2++;
                if(num2 < num1)output(',');
                printLn(isFormate);
            }
            printSpace(deep-1,isFormate);
            output('}');
            break;
        }
        case 7:{
            output('[');
            for(var j=0;j<obj.length-1;j++){
                printLn(isFormate);
                printSpace(deep,isFormate);
                mylog(obj[j],deep+1,isFormate);
                output(',');

            }
            if(obj.length > 0){
                printLn(isFormate);
                printSpace(deep,isFormate);
                mylog(obj[obj.length-1],deep+1,isFormate);
                printLn(isFormate);
            }
            printSpace(deep-1,isFormate);
            output(']');
            break;
        }
        default:{
            output(obj);
            break;
        }
    }
};
var printStr = function (str,isFormate){
    if(isFormate == null)isFormate = true;
    if(isFormate){
        output(str);
    }
};
var printSpace = function (deep,isFormate){
    for(var i=0;i<deep;i++){
        printStr(tabChar,isFormate);
    }
};
var printLn = function (isFormate){
    printStr(nextLine,isFormate);
};
var dataType = function (obj){
    var className = toString.call(obj);
    switch (className) {
      case '[object String]':
        return 1;
      case '[object Number]':
        return 2;
      case '[object Date]':
        return 3;
      case '[object Boolean]':
        return 4;
      case '[object RegExp]':
        return 5;
      case '[object Object]':
        return 6;
      case '[object Array]':
        return 7;
    }
    return 0;
};
module.exports = new myConsole();