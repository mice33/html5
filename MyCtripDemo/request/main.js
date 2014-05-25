//定义公用变量
window.PATH = {
  DEFAULTINDEX: 'index',  //默认页面
  VIEWS_PATH: 'request/views/', //页面view目录,helloworld为部署的虚拟目录
  TPL_PATH: 'request/templates/', //html模板目录
  BASEURL:      '/webapp/'  //根虚拟目录
}
//返回页面view目录
function getViewsPath() {
    return window.PATH.VIEWS_PATH; 
}
//返回requirejs打包后 js文件路径
function buildViewPath(htmlpath) {
    return getViewsPath() + htmlpath;
}
//返回requirejs打包后 html文件路径
function buildViewTemplatesPath(htmlpath) {
    return 'text!' + window.PATH.TPL_PATH + htmlpath;
}
//require js config
require.config({
  //baseUrl
  baseUrl: window.PATH.BASEURL,
  //paths
  paths: {
     
  }
});
//程序入口
require(['libs', 'App'], function (libs, App) {
  //实例化App
  var app = new App({
    'defaultView':  window.PATH.DEFAULTINDEX,
    'viewRootPath': window.PATH.VIEWS_PATH
  });
});