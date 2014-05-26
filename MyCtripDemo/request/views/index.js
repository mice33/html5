
define(['libs','cBasePageView','cModel','cBase',buildViewTemplatesPath('index.html')],function(libs,BasePageView,Model,Base,viewhtml){
		var ModelCase = new Base.Class(Model, {
		  __propertys__: function () {
		  	this.baseurl={domain:'m.ctrip.com',path:'api/soa2/'};
		    this.url = '10124/json/ProductSearch';
		    this.param =  {
                    "SaleCityId": 2,
                    "StartCityId": 2,
                    "KeyWord": "三亚",
                    "AddressSelectorId": 0,
                    "LineType": 1,
                    "Start": 1,
                    "ReturnCount": 20
                };
                //this.usehead = false;
		  },
		  initialize: function ($super, options) {
		    $super(options);
		  }
		});

		var modelinstance = ModelCase.getInstance();
		//modelinstance.baseurl='http://m.ctrip.com/api/soa2';

		var View = BasePageView.extend({
		onCreate: function () {
	      //this.$el.html(viewhtml);
	      this.injectHeaderView();
	    },
	    onLoad: function () {
	      // this.headerview就是View含有的HeaderView的全局对象
	      this.headerview.set({
	        title: 'Request Data Demo',
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

	      var success = function(data) {
	      	//alert(data);
		    console.log(data);
		    this.render(data);
		  };
		 
		  var error = function(e){
		    console.log(e);
		  };
		 
		  var complete = function(e){
		    console.log(e);
		  };
		 
		  modelinstance.excute(success, error, false, this, complete);

	      //...
	      this.turning();
	    },
	    render:function(data){
	    	var templateFn = _.template(viewhtml);
	    	var viewhtmldom = templateFn(data);
	    	this.$el.html(viewhtmldom);
	    }
	});
	return View;
});