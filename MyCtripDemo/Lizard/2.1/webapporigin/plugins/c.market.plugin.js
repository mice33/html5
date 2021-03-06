/**
 * @File c.market.plugin
 * @Description 页面切换时写入隐藏域唤醒url
 * @author wang_l@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(['cMessageCenter'], function (MessageCenter) {

  return function () {
    MessageCenter.subscribe('viewReady', function (inView) {
      //add by byl 在此处判断inView中的getAppUrl是否存在,如果存在将返回值添加到隐藏域app_url
      var appUrlDoom = $('#app_url');
      if (inView && typeof inView.getAppUrl === 'function') {
        var newAppUrl = inView.getAppUrl();
        if (newAppUrl && _.isString(newAppUrl)) {
          if (!appUrlDoom.length) {
            $('<INPUT type="hidden" id="app_url" value="' + newAppUrl + '"/>').appendTo($('body'));
          } else {
            appUrlDoom.val(newAppUrl);
          }
        }
      } else {
        if (appUrlDoom.length > 0) {
          appUrlDoom.val("");
        }
      }
    });
  };
});
