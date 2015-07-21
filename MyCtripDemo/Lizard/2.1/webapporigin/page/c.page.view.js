/**
 * @File c.page.view.js
 * @Description:多数UI View的基类，提供基础方法，以及自建事件机制
 * @author shbzhang@ctrip.com
 * @date 2014-09-30 15:23:20
 * @version V1.0
 */
/**
 * View 基类,继承自Backbone.View
 * @namespace View.cPageView
 * @example
 * defined('cPageView',function(cPageView){
 *  var view = cPageView.extend({
 *    //view初始化调用,在生命周期中只调用一次
 *    onCreate:function(){
 *    },
 *    //view显示时调用
 *    onShow:function(){
 *    ),
 *    //view隐藏调用
 *    onHide:function(){
 *    },
 *    //view获得视口时调用,此方法仅在hybrid有效
 *    onAppear:function(){
 *    }
 *  })
 * })
 */
define(['libs', (Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid)? 'cHybridHeader' : 'UIHeader', 'cGuiderService'],
  function (libs, Header, Guider) {
    "use strict";


    var PageView = Backbone.View.extend({
      /**
       * 滚动条位置
       * @var
       * @private
       */
      scrollPos: { x: 0, y: 0 },
      /**
       * 标题组件
       * @var View.cPageView.header
       * @type UIHeader
       */
      header   : null,


      /**
       * UBT统计用,web 环境下使用pageid,
       * @var View.cPageView.pageid
       * @type {number|string}
       */
      pageid: 0,

      /**
       * UBT统计用,hybrid 环境下使用pageid
       * @var View.cPageView.hpageid
       * @type {number|string}
       */
      hpageid: 0,

      /**
       * 页面切换时，是否要滚动至顶部
       * @var View.cPageView.scrollZero
       * @type {boolean}
       */
      scrollZero: true,

      /**
       * 页面切换时，是否执行onShow onHide
       * @var View.cPageView.triggerShow
       * @type {boolean}
       */
      triggerShow: true,

      /**
       * 页面切换时，是否执行onShow onHide
       * @var View.cPageView.triggerHide
       * @type {boolean}
       */
      triggerHide: true,

      /**
       * 直落代码,设置此属性和pageid属性后,将会开启电话号码直落功能
       * @var View.cPageView.businessCode
       * @type {string}
       */

      /**
       * 前一个页面的viewName
       * @var View.cPageView.lastViewId
       * @type {string}
       * @deprecated
       */

      /**
       * 前一个页面的viewName
       * @var View.cPageView.referrer
       * @type {string}
       */


      /**
       * View构造函数
       */
      initialize: function () {
        this.id = this.$el.attr("id");
        this.create();
      },

      /**
       * 生成头部
       */
      _createHeader: function () {
        var hDom = $('#headerview');
        this.header = this.headerview = new Header({ 'root': hDom, 'wrapper': hDom });
      },

      /**
       * create 方法,View首次初始化是调用
       * @method View.cPageView.onCreate
       */
      create: function () {
        //调用子类onCreate
        this.onCreate && this.onCreate();
        if (_.isArray(this.defferModules)) {
          var stopEvent = true, self = this, calledMethod;
          _.each(this.events, function(method, event){
            if (!_.isFunction(method)) method = self[method];            
            self.events[event] = function(e){
              if (stopEvent) {
                self.showLoading();
                calledMethod = {method: method, event: e};
                return;
              }
              self.hideLoading();
              method.apply(self, arguments); 
            };
          });
          setTimeout(_.bind(function(){require(this.defferModules, _.bind(function(){
            stopEvent = false;
            _.isFunction(this.defferModuleCallback) && this.defferModuleCallback.apply(this, arguments);
            if (_.isObject(calledMethod)) {
              calledMethod['method'].apply(this, [calledMethod.event]); self.hideLoading();
            }
          }, this))}, this), 1);
        }
      },

      /**
       * view 销毁方法
       * @method View.cPageView.destroy
       */
      destroy: function () {
        this.$el.remove();
      },

      /**
       * View 显示时调用的方法
       * @method View.cPageView.onShow
       */
      show: function () {
        // fix ios 页面切换键盘不消失的bug shbzhang 2014-10-22 10:44:29
        document.activeElement && document.activeElement.blur();
        //生成头部
        this._createHeader();
        //调用子类onShow方法
        !this.switchByOut && this.$el.show();

        this.triggerShow && this.onShow && this.onShow();

        this.onAfterShow && this.onAfterShow();

        //注册Web_view_did_appear 事件
        Guider.registerAppearEvent(_.bind(this.onAppearHandler, this));
        
        if (Lizard.app.vendor.is('CTRIP') && history.length == 1){
          this.__appeartimeout = setTimeout(_.bind(this.onAppearHandler, this), 1000);
        } 

        if (this.onBottomPull) {
          this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
          this.addScrollListener();
        }

        if (this.scrollZero) {
          window.scrollTo(0, 0);
        }

        this.triggerShow = true;
        this.triggerHide = true;

        //如果定义了addScrollListener,说明要监听滚动条事,此方法在cListView中实现
        this.addScrollListener && this.addScrollListener();
      },

      /**
       * View 隐藏
       * @method View.cPageView.onHide
       */
      hide: function () {
        //取消web_view_did_appear 事件的注册
        Guider.unregisterAppearEvent();
        //调用子类onHide方法
        this.triggerHide && this.onHide && this.onHide();
        this.removeScrollListener && this.removeScrollListener();
        this.$el.hide();
      },

      /**
       * View 从Native 回来，重新获取焦点时调用，此方法只在hybrid可用
       * @method View.cPageView.onAppear
       * @param {String} data 再次唤醒事由Native传来的参数
       */
      onAppear: function (data) {
        console.log('onAppear --------------');
      },
      
      onAppearHandler: function () {
        clearTimeout(this.__appeartimeout);
        this.sendUbt();
        this.onAppear();        
      },

      /**
       * 跨频道跳转,建议使用cross代替代替
       * @deprecated
       * @method View.cPageView.jump
       * @param {String|JSON} opt
       */
      jump: function (opt) {
        if (_.isString(opt)) {
          window.location.href = opt;
        } else {
          Guider.jump(opt);
        }
      },
      /**
       * 处理跨频道跳转, 屏蔽web与hybrid跨频道的不同,Lizard.jump的快捷方式
       * @method View.cPageView.cross
       * @param {String} url 要跳转的页面,支持http/https/ctripwireless和部分路径
       * @param {Object} [opt]  配置参数, 详细见{@link http://jimzhao2012.github.io/api/classes/CtripUtil.html#method_app_open_url},
       * @param {number} [opt.targetModel=4] 新页面打开方式,4为单页面打开,5为新webview打开
       * @param {boolean} [opt.replace=false] 是否在浏览器history中增加记录
       * @example
       *  //在web环境下, href会跳转至http://m.ctrip.com/webapp/ticket/index, hybrid环境中会打开ticket/index.html#/webapp/ticket/index
       *  //方式1
       *  Lizard.jump('http://m.ctrip.com/webapp/ticket/index')
       *  //方式2, web环境下会跳转至/webapp/myctrip/orders/allorders,hybrid环境中会打开myctrip/index.html#/webapp/myctrip/orders/allorders
       *  Lizard.jump(‘/webapp/myctrip/orders/allorders’)
       */
      cross   : function (url, opt) {
        Lizard.jump(url, opt);
      },
      /*add by wxj 20140527 22:33 end*/
      /**
       * 页面跳转方法,灵活使用此方法,也可实现跨页面跳转,该方法实际代理了Lizard.goTo
       * @method View.cPageView.forward
       * @param {String} url URL信息
       * @param {Object} [opt] 跨页跳转的配置参数,如不传此参数, 则为单页的view切换, 详细参数信息,见{@link http://jimzhao2012.github.io/api/classes/CtripUtil.html#method_app_open_url},
       * @param {String} [opt.targetModel] 打开模式  如果全局的Lizard.config.multiView=on开启,则取值为4
       *
       * 0.当前页面刷新url, 该参数类似于js的location.href="", 注：只支持打online地址
       *
       * 1.处理ctrip://协议; 注：只处理ctrip协议的URL Schema
       *
       * 2.开启新的H5页面,title生效; 注：只支持online地址
       *
       * 3.使用系统浏览器打开; 注：只支持online地址和其它App的URL Schema，例如微信的weixin://home
       *
       * 4.开启新的H5页面，title生效，打开webapp目录下的相对路径；注：和2对应，2打开online地址，4打开相对路径
       *
       * 5.当前页面打开webapp目录下相对路径；注：和0对应，0是打开online地址，5是打开本地相对路径。 5.8之前版本，内部自动调用app_cross_package_href
       * @param {String} [opt.pageName] view的唯一标示
       * @param {String} [opt.title]  当targetMode＝2时候，新打开的H5页面的title
       * @param {Boolean} [opt.isShowLoadingPage] 开启新的webview的时候，是否加载app的loading
       * @example
       * //新开WebView的方式打开 osd/osdindex webView的名称指定为webViewOsd
       * view.forward(Lizard.appBaseUrl + 'osd/osdindex', {targetModel: '4', pageName: 'webViewOsd'})
       * //在同一个webView中直接跳转到osd/osdindex
       * view.forward(Lizard.appBaseUrl + 'osd/osdindex')
       */
      forward: function (url, opt) {
        Lizard.forward.apply(null, arguments);
      },
      /**
       * 页面回退方法,如果在第一个页面回退,则自动会回退至native界面,该方法实际代理了Lizard.goBack
       * @method View.cPageView.back
       * @param {String} url URL信息
       * @param {Object} opt 设置信息
       * @param {String} [opt.pageName] 可选,如指定了此参数,多webview的情况,可回退至指定页面
       * @example
       * //回退至上一个页面,框架会判断如果是webview最先打开的页面会直接回退到上一个native页
       * view.goBack()
       * //多WebView的情况下,回退至已打开webViewOsd页面, {pageName: 'webViewOsd'})
       * view.goBack(Lizard.appBaseUrl + 'osd/osdindex', {pageName: 'webViewOsd'})
       */
      back   : function (url, opt) {
        Lizard.back.apply(null, arguments);
      },

      /**
       * 刷新页面
       */
      refresh  : function () {

      },
      /**
       * 唤醒App,要求返回一个app接受的字符串
       * @method View.cPageView.getAppUrl
       * @return {String} url
       */
      getAppUrl: function () {
        return "";
      },

      /**
       * 返回URL中参数的值
       * @method View.cPageView.getQuery
       * @param key
       * @returns {string} value 返回值
       */
      getQuery     : function (key) {
        return Lizard.P(key);
      },
      /**
       * 保存滚动条位置
       */
      saveScrollPos: function () {
        this.scrollPos = {
          x: window.scrollX,
          y: window.scrollY
        };
      },

      /**
       * 恢复原滚动条位置
       * @method View.cPageView.restoreScrollPos
       */
      restoreScrollPos: function () {
        window.scrollTo(this.scrollPos.x, this.scrollPos.y);
      },

      /**
       * 空方法,兼容1.1
       */
      turning    : function () {

      },
      /**
       * 同Lizard.showMessage. 以弹出框的形式，弹出提示信息,使用方式一
       * @method View.cPageView.showMessage
       * @param {string} message 需要弹出的信息
       * @example
       * view.showMessage('显示信息');
       */
      /**
       * 同Lizard.showMessage. 以弹出框的形式，弹出提示信息,使用方式二, 见{@link http://svn.ui.sh.ctripcorp.com/lizard/webapp/demo2.1/index.html#%2Fwebapp%2Fdemo2.1%2Fui%2Falert | UI Message Demo}
       * @method View.cPageView.showMessage
       * @param {object} params 弹出框数据解构
       * @param {object} params.datamodel 弹出框表现层数据结构
       * @param {string} params.datamodel.content 显示内容
       * @param {string} [params.datamodel.title] 标题文本
       * @param {string} [params.datamodel.okTxt] 按钮文本
       * @param {function} [params.okAction] 按钮回调函数
       * @example
       * view.showMessage({
       *    datamodel：
       *      {
       *        content："显示信息"，
       *        title："带标题",
       *        okTxt:"按钮文本",
       *      },
       *    okAction:function(){}   //按钮回调函数
       *  });
       */
      showMessage: function (params) {
        Lizard.showMessage(params);
      },

      /**
       * 隐藏由showMessage弹出的消息
       * @method View.cPageView.hideMessage
       */
      hideMessage: function () {
        Lizard.hideMessage();
      },

      /**
       * 同Lizard.showConfirm. 以弹出框的形式，弹出确认信息,使用方式一
       * @method View.cPageView.showConfirm
       * @param {String} message 需要弹出的信息
       * @example
       * view.showConfirm('显示信息')
       */
      /**
       * 同Lizard.showConfirm. 以弹出框的形式，弹出确认信息,使用方式二 见{@link http://svn.ui.sh.ctripcorp.com/lizard/webapp/demo2.1/index.html#%2Fwebapp%2Fdemo2.1%2Fui%2Falert | UI Message Demo}
       * @param {Object} param 需要弹出的信息
       * @method View.cPageView.showConfirm
       * @param {object} params 弹出框数据解构
       * @param {object} params.datamodel 弹出框表现层数据结构
       * @param {string} params.datamodel.content 显示内容
       * @param {string} params.datamodel.title 标题文本
       * @param {array} [params.datamodel.btns] 按钮数组
       * @param {string} [params.datamodel.btn.name] 按钮标题
       * @param {string} [params.datamodel.btn.className] 按钮样式
       * @param {function} params.okAction 确认按钮回调函数
       * @param {function} params.cancleAction 取消按钮回调函数
       * @example
       * view.showConfirem({
       *    datamodel：
       *      {
       *        content："显示信息"，
       *        title："带标题",
       *         btns: [
       *              { name: '取消', className: 'cui-btns-cancel' },
       *              { name: '确定', className: 'cui-btns-ok' }
       *            ]//对应按钮
       *      },
       *    okAction:function(){},           //确认按钮回调
       *    cancleAction:function(){}       //取消按钮的回调
       *  });
       */
      showConfirm: function (params) {
        Lizard.showConfirm(params);
      },

      /**
       * 隐藏由showConfirm 弹出的确认信息框
       * @method View.cPageView.hideConfirm
       */
      hideConfirm: function () {
        Lizard.hideConfirm();
      },


      /**
       * 显示全局单例的404页面,使用方式一
       * @param {Function} [retryFun] 点击重试的回调
       * @method View.cPageView.showWarning404
       */

      /**
       * 全局单例的warning404,使用方式二,
       * @method View.cPageView.showWarning404
       * @param {Object} params  组件数据结构
       * @param {Object} params.datamodel  组件表现层数据结构
       * @param {String} params.datamodel.tel 拨打电话
       * @param {String} params.datamodel.loadFail 加载失败文本
       * @param {String} params.datamodel.telText 拨打电话文本
       * @param {String} params.datamodel.tryAgain 重试文本
       * @param {String} params.datamodel.contact 联系客服文本
       * @param {String} params.datamodel.showContact 是否联系客服文本
       * @param {Function} params.callTelAction 拨打电话回调函数
       * @param {Function} params.callTelAction 重试回调函数
       * @param {Object} [pageConfig=null] 页面配置。此参数已经废弃，这里暂时和之前的版本保持兼容，默认传null即可
       * @param {Object} [headData] 头部设置，用于设置头部的数据,见{@link http://svn.ui.sh.ctripcorp.com/lizard/webapp/demo2.1/index.html#%2Fwebapp%2Fdemo2.1%2Fui%2Fnew_header |UI Header Demo}

       * @example
       * view.showWarning404({
       *   datamodel: {
       *     tel: '4000086666',
       *     loadFail: '加载失败，请稍后再试试吧',
       *     telText: '或者拨打携程客服电话',
       *     tryAgain: '重试',
       *     contact: '联系客服',
       *     showContact: true
       *    },
       *    callTelAction: function() {}, //拨打客服电话的回调
       *    retryAction: function(){}   // 点击重试按钮的回调
       * });
       */
      showWarning404: function (params) {
        Lizard.showWarning404(params);

      },

      /**
       * 关闭由showWarning404弹出的提示框
       * @method View.cPageView.hideWarning404
       */
      hideWarning404: function () {
        Lizard.hideWarning404();
      },

      /**
       * 显示提示信息，在一定时间内自动消失,使用方式一
       * @method View.cPageView.showToast
       * @param {String} message 需要显示的消息
       * @example
       * view.showToast('你好')
       */
      /**
       * 显示提示信息，在一定时间内自动消失,使用方式二, 见 {@link http://svn.ui.sh.ctripcorp.com/lizard/webapp/demo2.1/index.html#%2Fwebapp%2Fdemo2.1%2Fui%2Ftoast | UI toast Demo}
       * @method View.cPageView.showToast
       * @param {object} params 弹出框数据解构
       * @param {object} params.datamodel 弹出框表现层数据结构
       * @param {string} params.datamodel.content 显示内容
       * @param {function} hideAction 关闭消息是的回调
       * @example
       * view.showToast({
       *    datamodel:{
       *          content: '消息内容'
       *       }
       *       hideAction: function() {}//关闭消息时执行的回调
       *    });
       */
      showToast: function (params) {
        Lizard.showToast(params);
      },

      /**
       * 隐藏toast
       * @method View.cPageView.hideToast
       */
      hideToast: function () {
        Lizard.hideToast();
      },

      /**
       * 显示携程的loading 图标,见{@link http://svn.ui.sh.ctripcorp.com/lizard/webapp/demo2.1/index.html#%2Fwebapp%2Fdemo2.1%2Fui%2Floading | UI Loading Demo}
       * @method View.cPageView.showLoading
       * @param {Object} [params] loading数据结构
       * @param {Object} params.datamodel 表现层数据结构
       * @param {String} params.datamodel.content 显示文本
       * @param {Boolean} [params.datamodel.closeBtn=false] 是否显示关闭按钮
       *
       * @example
       * //方式一
       * Lizard.showLoading()
       * //方式二
       * Lizard.showLoading({
       *      datamodel: {
       *        content: '加载中...',
       *        closeBtn: true
       *      }
       * });
       */
      showLoading: function (params) {
        Lizard.showLoading(params);
        //        this.loading.firer = this;
      },

      /**
       * 隐藏Loading
       * @method View.cPageView.hideLoading
       */
      hideLoading: function () {
        //        if (!this.loading.firer || this.loading.firer == this)
        Lizard.hideLoading();
      },


      /**
       * 设置html的title
       * @method View.cPageView.setTitle
       * @param title
       */
      setTitle: function (title) {
        document.title = title;
      },


      /**
       * 发送UBT统计代码
       * @method View.cPageView.sendUbt
       */
      sendUbt: function () {
        Lizard.sendUbt(this);
      }
    })
    return PageView;

  });