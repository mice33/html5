console.info("into control index.js");

define(['cPageView'], function (pageview) {

	var self;
    var view = pageview.extend({

     	onCreate: function() {
            self = this;
        },

        setHead:function(){
        	var self = this;
        	this.header.set({
        		title: 'My Tour Index',
		        back: true,
		        home: true,
		        tel: {
		          number: 4000086666
		        },
		        events: {
		          returnHandler: function () {
		          	console.info("click back button");
		          },
		          homeHandler: function () {
		          	console.info("click home button");
		          }
		        }
        	});
        },

        onShow: function () {
        	self.setHead();
        }

    });


    return view;

});