
"use strict"

define(['libs', 'cBasePageView'], function (libs, BasePageView) {

	var templateStr = '<h1 id="mtve"><%=title%></h1>';


	var View = BasePageView.extend({
		render:function(data){
			var templateFn = _.template(templateStr);
			var viewhtml = templateFn(data);
			this.$el.html(viewhtml);
		},

		events:{
			'click #mtve':'clickExample'
		},

		onCreate: function () {
	      this.injectHeaderView();
	    },
	    onLoad: function () {
	      // this.headerview就是View含有的HeaderView的全局对象
	      this.headerview.set({
	        title:'MTVE模型',
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
	      this.render({title:'this is MTVE Demo,点我试试<br>Model 基于cStore实现的数据存数和读取,<br>Template 基于underscore的模板,<br>View 基于cUIView的显示层,<br>Event 基于事件触发模型的Event Router'});
	      this.turning();
	    },
	    clickExample:function(){
	    	alert('点我了');
	    }
	});

	return View;
});