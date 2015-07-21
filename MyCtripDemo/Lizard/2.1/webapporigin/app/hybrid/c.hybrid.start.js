(function () {
  //这句代码看似无用，其实是为兼容之前BUAPP直连直接将Lizard.hybrid.js写道标签中做一个判断
  if (!_.isFunction(Lizard.mutileLoad)) {return;}
  var mutileLoad = Lizard.mutileLoad;
  delete Lizard.mutileLoad;
  window.appInstance = false;
  window.localStorage.setItem('ISINAPP', '1');
  window.app = {};
  var initTimeout;
  if(Lizard.isHybrid && $.os.ios){
    //add by byl 此处添加判断，直连时不走这块逻辑
    initTimeout = setTimeout(function(){
      if (!Lizard.instance) {
        location.reload();
      }
    }, 500);
  }
  window.app.callback = function (options) {
    var methods = {
      'web_view_finished_load': function () {
        !(_.isUndefined(initTimeout))&&clearTimeout(initTimeout);
        if (window.localStorage) {
          var appInfo = options.param;
          if (appInfo)
            window.localStorage.setItem('APPINFO', JSON.stringify(appInfo));
        }
        //CtripBar.app_set_navbar_hidden(true);        
        CtripUtil.app_init_member_H5_info();
      },

      'init_member_H5_info': function (params) {
        define("_", function () {
        });
        define("$", function () {
        });
        define("B", function () {
        });
        define("F", function () {
        });
        require(['libs', 'cCommonStore'],
          function (libs, CommonStore) {
            window.appInstance = true;
            var wStore = window.localStorage;
            if (wStore && params) {
              var headStore = CommonStore.HeadStore.getInstance();
              var userStore = CommonStore.UserStore.getInstance();
              var unionStore = CommonStore.UnionStore.getInstance();
              var headInfo = headStore.get();

              //用户信息
              if (params.userInfo) {
                try {
                  var userInfo = userStore.getUser();
                  params.userInfo.data.BMobile = params.userInfo.data.BindMobile;
                  userStore.setUser(params.userInfo.data);
                  headInfo.auth = params.userInfo.data.Auth;
                } catch (e) {
                  alert('set data error');
                }
              } else {
                userStore.removeUser();
              }

              if (params.device) {
                var deviceInfo = {
                  device: params.device
                }
                wStore.setItem('DEVICEINFO', JSON.stringify(deviceInfo));
              }

              if (params.appId) {
                var appInfo = {
                  version: params.version,
                  appId: params.appId,
                  serverVersion: params.serverVersion,
                  platform: params.platform
                }
                wStore.setItem('APPINFO', JSON.stringify(appInfo));
              }

              if (params.timestamp) {
                var date = new Date();
                var serverdate = {
                  server: params.timestamp,
                  local: date.getTime()
                }
                wStore.setItem('SERVERDATE', JSON.stringify(serverdate));
              }

              if (params.sourceId) {
                headInfo.sid = params.sourceId;
                wStore.setItem('SOURCEID', params.sourceId);
              }

              if (params.isPreProduction) {
                wStore.setItem('isPreProduction', params.isPreProduction);
              }

              //接受clientId,供UBT使用
              if (params.clientID) {
                headInfo.cid = params.clientID;
                wStore.setItem('GUID', params.clientID);
              }
              //外部渠道号
              if (params.extSouceID) {
                headInfo.xsid = params.extSouceID;
              }
              //hybrid下直接接受App传递的参数,标准版-iOS:12, android:32; 学生版－ios:16, Android:36, since 5.6
              if (params.systemCode) {
                headInfo.syscode = params.systemCode;
              }
              if (params.version) {
                headInfo.cver = params.internalVersion || params.version;
              }

              //分销联盟参数
              //ctrip://wireless/allianceID=123&ouID=456&sID=789&extendSourceID=11111
              if (params.allianceID && params.sID) {
                var union = {
                  "AllianceID": params.allianceID,
                  "SID": params.sID,
                  "OUID": params.ouID ? params.ouID : ""
                }
                unionStore.set(union);
              }

              headStore.set(headInfo);

              //保存原始参数值
              wStore.setItem('CINFO',JSON.stringify(params));
            }

            if (Lizard.app.vendor.is('CTRIP'))
              mutileLoad();
          });
      },

      'app_h5_need_refresh': function () {
        mutileLoad();
      }
    }
    if (options && typeof methods[options.tagname] === 'function') {
      methods[options.tagname](options.param);
    }
  };
  if (!Lizard.app.vendor.is('CTRIP'))
    mutileLoad();  
})();
