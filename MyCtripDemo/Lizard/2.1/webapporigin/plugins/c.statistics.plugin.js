/**
 * @File c.market.plugin
 * @Description 页面切换时送UBT,K
 * @author wang_l@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(['cMessageCenter'], function (MessageCenter) {

  return function () {
    //注册切换时,发送统计数据
    MessageCenter.subscribe('viewReady', function (view) {
      !Lizard.app.vendor.is('CTRIP') && Lizard.sendUbt(view);
      //_sendGA();
      googleRemark(view);
      //Kenshoo统计代码 add by byl
      _sendKenshoo();
      _sendMarin();
    });


    /**
     * 发送UBT统计数据
     * @param {View} view
     */
    Lizard.sendUbt = function (view) {
      if(!view) return;
      if (!window.__bfi) window.__bfi = [];
      var url = view.$el.attr('page-url'),
        pageId = getPageId(view),
        orderId = Lizard.P("orderid") || Lizard.P("oid") || "";
      if (pageId === 0) {
        return;
      }
      if($('#bf_ubt_orderid').length > 0){
        $('#bf_ubt_orderid').val(orderId);
      }
      //var ubtURL = window.location.protocol + '//' + window.location.host + url;
      var refererView = Lizard.instance.views[view.referrer];
      window.__bfi.push(['_asynRefresh', {
        page_id: pageId,
        orderid: orderId,
        url: getViewUrl(view),
        refer: refererView ? getViewUrl(refererView) : document.referrer
      }]);
    };

    /*
     * 页面切换时,应首先向ubt发送unload
     */
    Lizard.unloadUbt = function (view) {
      if(!view) return;
      if (!window.__bfi) window.__bfi = [];
      window.__bfi.push(['_unload', {
        page_id: getPageId(view),
        url: getViewUrl(view),
        refer: view ? getViewUrl(view) : document.referrer
      }]);
    }

    var getViewUrl = function (view) {
      var url = "";
      if (!view) return;
      if (Lizard.isHybrid || Lizard.app.vendor.is('CTRIP')) {
        var url = view.$el.attr('page-url');
        url = 'http://hybridm.ctrip.com' + ((url.indexOf('/') == 0) ? view.$el.attr('page-url') : '/' + (view.$el.attr('page-url')) );
      } else {
        url = window.location.protocol + '//' + window.location.host + view.$el.attr('page-url')
      }
      return url;
    };

    var getPageId = function (view) {
      return (Lizard.isHybrid || Lizard.app.vendor.is('CTRIP')) ? view.hpageid : view.pageid;
    };
    /**
     * Kenshoo统计代码
     */
    var _sendKenshoo = function () {
      var orderID = Lizard.P("orderID"), // || Lizard.P("oId") ; 此处暂不写oid的统计，没有明确文档说明oid需要统计
        type = Lizard.P("type") || Lizard.P("busType") || '',
        val = Lizard.P("val") || Lizard.P("price") || '';
      if (orderID) {
        var kurl = "https://2113.xg4ken.com/media/redir.php?track=1&token=8515ce29-9946-4d41-9edc-2907d0a92490&promoCode=&valueCurrency=CNY&GCID=&kw=&product="
        kurl += "&val=" + val + "&orderId=" + orderID + "&type=" + type;
        var imgHtml = "<img style='position: absolute;' width='1' height='1' src='" + kurl + "'/>"
        $('body').append(imgHtml);
      }
    };

    /**
     * 发送Marinsm 统计
     */
    var _sendMarin = function () {
      var orderID = Lizard.P("orderID"), // || Lizard.P("oId") ;
        type = Lizard.P("type") || Lizard.P("busType") || '',
        val = Lizard.P("val") || Lizard.P("price") || '';
      if (orderID) {
        var murl = "https://tracker.marinsm.com/tp?act=2&cid=6484iki26001&script=no"
        murl += "&price=" + val + "&orderid=" + orderID + "&convtype=" + type;
        var imgHtml = "<img style='position: absolute;' width='1' height='1' src='" + murl + "'/>"
        $('body').append(imgHtml);
      }
    };

    /**
     * GA统计
     */
    var _sendGA = function () {
      if (typeof ga !== 'undefined') {
        ga('send', 'pageview', location.href);
      }
    };

    /**
     * google营销
     * @param view
     */
    var googleRemark = function (view) {
      if (Lizard.isHybrid) {
        var url = getViewUrl(view);
        var method = CtripBusiness && CtripBusiness.app_log_google_remarkting;
        typeof  method == 'function' && method(url);
      } else {

      }
    };
  };
});
