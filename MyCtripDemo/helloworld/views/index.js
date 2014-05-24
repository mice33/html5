"use strict"
define(['libs', 'cBasePageView'], function (libs, BasePageView) {
  var viewhtml = '<h1>Hello World</h1><div><button>点击我去list</button></div>';
  var View = BasePageView.extend({
    onCreate: function () {
      this.$el.html(viewhtml);
      this.injectHeaderView();
    },
    onLoad: function () {
      // this.headerview就是View含有的HeaderView的全局对象
      this.headerview.set({
        title:'导航',
        view:true,
        back:true,
        home:true,
        tel:{
          number:18017642268
        },
        events:{
          //返回做什么
          returnHandler: function () {
            console.info("点击了返回...");    
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
    },
    events:{
      'click button':'GoTo'
    },
    GoTo:function(){
      this.forward('list');
    },
  });
  return View;
});