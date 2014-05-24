"use strict"
define(['libs', 'cBasePageView'], function (libs, BasePageView) {
  var viewhtml = '<h1>我是列表页</h1>';
  var View = BasePageView.extend({
    onCreate: function () {
      this.$el.html(viewhtml);
      this.injectHeaderView();
    },
    onLoad: function () {
      // this.headerview就是View含有的HeaderView的全局对象
      this.headerview.set({
        title:'列表页',
        view:true,
        back:true,
        home:true,
        tel:{
          number:18017642268
        },
        events:{
          //返回做什么
          returnHandler: function () {
            //this.back('index');
            //this.goBack();
            console.info("点击了返回...");    
            this.back();

          },
          //点击首页做什么
          homeHandler: function () {
            console.info("点击了首页图标...");
          }
        }

      });

      //显示headerview
      this.headerview.show();
      this.turning();
    },
    onShow: function () {
    },
    onHide: function () {
    }
  });
  return View;
});