var libs = 'libs_v1.0_build201403181345.js';
var iswinphone = window.navigator.userAgent.indexOf('IEMobile') > -1 ? true : false;
var isie = window.navigator.userAgent.indexOf('MSIE') > -1 ? true : false;
var version = 0;
var SUPPORT_VERSION = 10;

//if (iswinphone) {
//  version = window.navigator.useragent.match(/iemobile\/\d+/);
//  if (version.length > 0) {
//    version = version[0].split('/');
//    version = version[1];
//  };
//};

// if (!('__proto__' in {}) || (iswinphone && version < 10)) {
//if ( (isie && !iswinphone) || (iswinphone && version < 10)){

// @description 使用userAgent判断是不是在IE环境，IE环境全部切到jQuery
if(iswinphone || isie){
  libs = 'libs_jq_r_1.1.js';
}
document.write('<script type="text/javascript" src="http://res.m.ctrip.com/html5/scripts/' + libs + '"></' + 'script>');