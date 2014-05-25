"use strict";
define(['libs','cBasePageView','cStore','cBase',buildViewTemplatesPath('index.html')],function(libs,BasePageView,Store,Base,viewhtml){

	var StoreCase = new Base.Class(Store, {
	    __propertys__: function () {
	      this.key = 'STORAGE_EXAMPLE' //设置在localstorage中的key值
	      this.lifeTime ='30S' //D代表天，H代表小时，M代表分钟，S代表秒
	    },
	    initialize: function ($super, options) {
	      $super(options);
	    }
    });

	var storeinstance = StoreCase.getInstance();

	var View = BasePageView.extend({
		onCreate: function () {
	      this.$el.html(viewhtml);
	      this.injectHeaderView();
	    },
	    onLoad: function () {
	      // this.headerview就是View含有的HeaderView的全局对象
	      this.headerview.set({
	        title: 'Store Demo',
	        view: this,
	        back: true,
	        home: true,
	        tel: {
	          number: 4000086666
	        },
	        events: {
	          returnHandler: function () {
	          },
	          homeHandler: function () {
	          }
	        }
	      });
	      // 显示headerview
	      this.headerview.show();
	      //...
	      this.turning();
	    },
	    events:{
	    	'click #saveBtn':'Save',
	    	'click #readBtn':'Read',
	    	'click #deleteBtn':'_delete'
	    },
	    Save:function(){
	    	var value = $("#inputvalue").val();
	    	storeinstance.set({inputvalue:value});
	    },
	    Read:function(){
	    	var value = storeinstance.get();
	    	console.log(value);
	    },
	    _delete:function(){
	    	storeinstance.remove();
	    }
	});


	return View;
});