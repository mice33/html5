/** 
 * @File lizard.seed.js
 * Lizard基础类，框架种子文件
 * @author wxj@ctrip.com/luwei@ctripcom
 * @version V2.1
 */
/**
 * Lizard框架的基础类,全局属性,绑定了一写常用的方法
 * @namespace Global.Lizard
 * @example
 *
 * //页面跳转
 * Lizard.goTo()
 * //页面回退
 * Lizard.goBack()
 * //跨页面跳转
 * Lizard.jump()
 *
 * //读取URL变量
 * Lizard.P()
 * //读取模板配置
 * Lizard.T()
 * //读取Model配置
 * Lizard.D()
 * //读取LocalStorage
 * Lizard.S()
 *
 * //显示Alert
 * Lizard.showMessage()
 * //显示Confirm
 * Lizard.showConfirm()
 * //显示Toast
 * Lizard.showToast()
 * //显示Loading
 * Lizard.Loading()
 */

(function () {
  //初始化Lizard命名空间
  
  	/*…jiangjing@ctrip.com…2015-01-08…*/
	/**
	 * @var {Object} Global.Lizard.app 当前宿主应用程序的相关信息
	 * @example
	 *
	 * // 判断当前 APP 是否由携程自主开发
	 * Lizard.app.vendor.is('CTRIP')
	 * 
	 * // 判断当前 APP 是否主版
	 * Lizard.app.code.is('MASTER')
	 *
	 * // 判断当前 APP 是否青春版
	 * Lizard.app.code.is('YOUTH')
	 *
	 * // 判断当前 APP 是否攻略社区版
	 * Lizard.app.code.is('GS')
	 *
	 * // 判断当前 APP 的版本号是否小于、小于等于、等于、大于等于、大于某个特定版本号
	 * Lizard.app.version.lt(6.1)
	 * Lizard.app.version.lte(6.1)
	 * Lizard.app.version.eq(6.1)
	 * Lizard.app.version.gte(6.1)
	 * Lizard.app.version.gt(6.1)
	 */
	 function AppInfo() {
    var
      // 各版本特征码
      ATTRS = {
        // 主版
        MASTER : 'Ctrip_CtripWireless' ,

        // 青春版
        YOUTH  : 'Youth_CtripWireless' ,

        // 攻略社区
        GS     : 'gs_wireless'
      },

      // 厂商代号一律为大写英文字母
      _VENDOR, 

      // 应用代码一律为大写英文字母
      _CODE, 

      _version, _normVersion, 

      // 将版本号各部分前缀补零，以方便不同版本号之间的比较，e.g.
      // 5.10 -> 005.010
      // 6.0  -> 006.000
      normVersion = function(/*String|Number*/ version) {
        // 强制转制成字符串
        version += '';

        // 假设一种情况，实参为数字 6.0，则小数部分将被忽略。故：
        // 如果版本号不含次版本号，则强制添加次版本号为 0
        if (version.indexOf('.') < 0) version += '.0';

        version = (version + '').split('.');
        for (var iterator = 0; iterator < version.length; iterator++) {
          version[iterator] = '000'.substr(version[iterator].length) + version[iterator];
        }
        return version.join('.');
      }, 

      RE = RegExp,

      UA = window.navigator.userAgent;

    // 逐一对比特征码与 userAgent 信息
    for (var iterator in ATTRS)
      if (new RE(ATTRS[iterator] + '_([\\d.]+)$').test(UA)) {
        _VENDOR = 'CTRIP';
        _CODE = iterator;
        _version = RE.$1;
        break;
      }

    if (!_VENDOR)
      // 第三方厂商：微信
      if (/MicroMessenger\/([\d.]+)/.test(UA)) {
        _VENDOR  = 'TECENT';
        _CODE    = 'WEIXIN';
        _version = RE.$1;
      }

    // 版本号规范化处理
    if (_version)
      _normVersion = normVersion(_version);

    return {
      // 厂商
      vendor: {
        toString: function() { return _VENDOR; },

        is: function(vendor) {
          return vendor.toUpperCase() == _VENDOR;
        }
      },

      // 代号
      code: {
        toString: function() { return _CODE; },

        is: function(code) {
          return code.toUpperCase() == _CODE;
        }
      },

      // 版本
      version: {
        toString: function() { return _version; },

        lt  : function(version) { return _normVersion <  normVersion(version); },
        lte : function(version) { return _normVersion <= normVersion(version); },
        eq  : function(version) { return _normVersion == normVersion(version); },
        gte : function(version) { return _normVersion >= normVersion(version); },
        gt  : function(version) { return _normVersion >  normVersion(version); }
      }
    };
  };

  Lizard = typeof Lizard != 'undefined' ? Lizard : {
    /**
     * Lizard 版本
     * @var {String} [Global.Lizard.version=2.1]
     */
    version     : "2.1",
    app         : AppInfo(),
    /**
     * 判断现在运行的包是否是Hybrid包
     * @var {Boolean} Global.Lizard.isHybrid
     */
    isHybrid    : !!(window.LizardLocalroute),
    /**
     * 判断是否在携程的APP中打开H5页面
     * @var {Boolean} Global.Lizard.isInCtripApp
     */
    isInCtripApp: !!(navigator.userAgent.match(/ctripwireless/i) && (window.location.protocol != "file:")),

    /**
     * 当页面切换完成时调用,用于Lizard与外部的借口,外部可以注册这个方法
     * @method Global.Lizard.viewReady
     * @param {View} view 切换完成后,当前的view对象
     */
    viewReady  : function (fn) {
      Lizard.readyQueue?Lizard.readyQueue.push(fn):(Lizard.readyQueue = [fn]);
    },
    notpackaged: typeof require == 'undefined'
  };



  //初始化lizard属性
  initLizardConfig();
  //加载资源文件
  loadRes();
  window.Lizard = Lizard;


  /*
   * 组织UI组件路径
   * @param path
   * @returns {string}
   */
  window.getAppUITemplatePath = function (path) {
    if (!Lizard.notpackaged) return 'text!' + 'ui/' + path + '.html';
    if (document.location.href.indexOf('172.16.140.104:5389') > 0 || document.location.href.indexOf('localhost') > 0)
      return 'text!' + Lizard.dir + 'ui/' + path + '.html';

    return 'text!' + 'ui/' + path + '.html';
  }

  window.getAppUICssPath = function (path) {
    if (!Lizard.notpackaged) return 'text!' + 'ui/' + path + '.css';
    if (document.location.href.indexOf('172.16.140.104:5389') > 0 || document.location.href.indexOf('localhost') > 0)
      return 'text!' + Lizard.dir + 'ui/' + path + '.css';

    return 'text!' + 'ui/' + path + '.css';
  }

  /*
   * 加载单个js文件
   * @param url
   * @param callback
   */
  function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.async = true;
    script.onload = callback;
    script.src = url;
    document.head.appendChild(script);
  }

  /*
   * 加载多个js文件
   * @param scripts
   * @param callback
   */
  function mutileLoad(scripts, callback) {
    var len = scripts.length;
    var no = 0;
    if (!len) {
      end();
      return;
    }
    for (var i = 0; i < len; i++) {
      var url = scripts[i];
      loadScript(url, end);
    }

    function end() {
      no++;
      if (no >= len) {
        callback();
      }
    }
  }

  /*
   * 解析lizard.seed.js标签的属性，初始化izard.dir,Lizard.pdConfig
   * Lizard.config 三个属性
   */
  function initLizardConfig() {
    var scripts = document.getElementsByTagName('script') || [];
    var reg = /lizard\.seed\.(beta\.|beta.src\.|src\.|\b)*js.*$/ig;
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src");
      if (src && reg.test(src)) {
        Lizard.dir = src.replace(reg, '');
        if (src.indexOf('beta') > -1) Lizard.uibeta_sandbox = true;
        var configStr = scripts[i].getAttribute("pdConfig") || '';
        Lizard.pdConfig = JSON.parse('["' + configStr.split(',').join('","') + '"]');
        if (scripts[i].getAttribute("lizardConfig")) {
          try {
            eval('Lizard.config = {' + scripts[i].getAttribute("lizardConfig") + '}')
          } catch (e) {
            console.log(e.stack)
          }
        } else {
          Lizard.config = {};
        }
        break;
      }
    }
  }


  /*
   * 加载AMD模块文件
   * @param e
   */
  function amdLoaderLoaded(e) {
    var configModel = Lizard.notpackaged ? [Lizard.dir + 'config.js'] : ['config']
    require(configModel, function () {
      var reqs = [];
      if (!Lizard.isHybrid) {
        // if (Lizard.isInCtripApp) {
        if (Lizard.app.vendor.is('CTRIP') /**by vlw S43481 || Lizard.app.code.is('GS') **/) {
          reqs.push('cHybridAppInit');
          reqs.push('cStatic');
        }
        else {
          reqs.push('cWebAppInit');
        }
      }
      else {
        reqs.push('cHybridAppInit');
      }
      if (!Lizard.notpackaged) {
        if (Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) {
          reqs.push('cBaseInit');
        }
        define("_", function () {
        });
        define("$", function () {
        });
        define("B", function () {
        });
        define("F", function () {
        });
      }
      require(['_', '$'], function () {
        /**
         * webresources站点的根目录地址,获取meta中webresourceBaseUrl的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.webresourceBaseUrl
         * @example
         * meta name="webresourceBaseUrl" content="http://webresource.c-ctrip.com/" lizardExpansion="true"
         */

        /**
         * PD的webresources站点的根目录地址,获取meta中WebresourcePDBaseUrl的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.WebresourcePDBaseUrl
         * @example
         * meta name="WebresourcePDBaseUrl" content="/webapp/car/webresource/" lizardExpansion="true"
         */

        /**
         * BU app的根目录地址,获取meta中appBaseUrl的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.appBaseUrl
         * @example
         *  meta name="appBaseUrl" content="/webapp/car/" lizardExpansion="true"
         */

        /**
         * restfullApi 是获取http数据的地址,获取meta中restfullApi的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.restfullApi
         * @example
         * meta name="restfullApi" content="http://m.ctrip.com/restapi/soa2/10134" lizardExpansion="true"
         */

        /**
         * restfullApiHttps 是获取https数据的地址,获取meta中restfullApiHttps的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.restfullApiHttps
         */

        /**
         * timeout 全局的ajax取数据的超时时间,默认为30s, 可以在html的meta属性指定
         * @var {String} [Global.Lizard.timeout=30s]
         * @example
         * meta name="timeout" content="5000" lizardExpansion="true"
         */

        /**
         * multiView hybrid下,是否开通多webView,默认为false
         * @var {String} [Global.Lizard.config.multiView=off]
         * @example
         * script type="text/javascript" src="http://localhost/code/lizard/2.1/6.2/dev/webapporigin/lizard.seed.js" lizardConfig ="multiView:'on'" 
         */
        var lizardExpansions = ["appBaseUrl", "webresourceBaseUrl", "restfullApi", "restfullApiHttps", "WebresourcePDBaseUrl"];
        _.each($('meta'), function (metatag) {
          var tagObj = $(metatag);
          if (tagObj.attr('lizardExpansion') || _.contains(lizardExpansions, tagObj.attr('name'))) {
            Lizard[tagObj.attr('name')] = tagObj.attr('content');
          }
        });
        require(reqs, function () {
          if (_.isFunction(arguments[arguments.length - 1])) {
            arguments[arguments.length - 1]();
          }
        });
      });
    });
  }

  /*
   * 加载资源文件
   */
  function loadRes() {
    var basescripts = [];
    if (Lizard.notpackaged) {
      basescripts = [Lizard.dir + "3rdlibs/require.min.js"];
    } else {
      if (!Lizard.app.code.is('MASTER') && !Lizard.app.code.is('YOUTH') && !Lizard.isHybrid) {
        basescripts.push(Lizard.uibeta_sandbox?Lizard.dir + 'lizard.web.beta.js':Lizard.dir + 'lizard.web.js');
      }
      if (Lizard.isHybrid && !Lizard.notpackaged) {
        //hybrid 环境下,根据引用目录,载入UBT文件 shbzhang
        var src = "ubt/_mubt.min.js";
        var lizardDir = Lizard.dir;
        if (lizardDir) {
          var path = lizardDir.substr(0, lizardDir.indexOf('lizard/webresource'));
          src = path + src;
        }
        require([src], function(){});
      }
    }
    if (Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) {
      Lizard.mutileLoad = function () {
        mutileLoad(basescripts, amdLoaderLoaded);
      };
    } else {
      mutileLoad(basescripts, amdLoaderLoaded);
    }
  }
  
  !(Lizard.isHybrid) && Lizard.app.vendor.is('CTRIP') && !(_.find($('SCRIPT'), function(script){return $(script).attr('src').indexOf('lizard.hybrid.js') > -1})) && document.write('<script src="' + Lizard.dir + 'lizard.hybrid.js"><\/script>');
})();