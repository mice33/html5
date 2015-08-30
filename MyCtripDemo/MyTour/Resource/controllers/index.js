console.info("into control index.js");

define(['cPageView','TourModel'], function (pageview,tourModel) {

	var self;
	var nopic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAAA1CAYAAAAj1uf0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAABKlJREFUeF7tnFlu6zAMRbv/BXZIxzTp3D344QS4gSDIFuW4pIznD6OJTQ86pK4oWunVz8/PsG2+DK424L7A4b1BD+jpG/QNun9Xj5DXVUf67+/vKQn4/v4+b3zX/giglnuuEvrn5+fw+vo6PDw8DHd3d8Pt7e1wc3Nz+sv3p6en4f39vdusbFXQ397ehsfHxzNkQE9t2OIgS/R52qwC+sfHxwl2DXLp+P39/fD19dUV+O6hIyOSjxr06+vrgS23e3l56Urnu4VOdKLZNdA6ju3hcBiOx+NJ09Pz0HlP+ajdKxw6mUaebSAnu93ODBxbgAMb6GQzqRzRU9B29teAeBwPgw4EBkZgsfGZfWQdRKY1wrFDPgDPNdjoJcBPr8Fx9L2HzMYdOlCQgpJOW7U7d8h+vz8B5a96TQ49PYf7RA6ubtDV5UsDXUtUl2zpGUoniXp6DE6Yui4S5iElpXu4QAd4PrhdCjo/H/DPz89nqRm7Pk6np0Xquwt0ovAvInzKcWOzVRwTKS1upV1pLgMm3ZrBstb9L+0JDJzk+Dic+7FFw5bUuER6qQgF/EvBTp0P9B4ylTBNL92YCFwaOqAZSInqSM2uDdBukZ4/SMts0+IcYPcMOm1/CPS/kBZ6Ti3CejkeAp0MwhK9LTY9189zZ7tDRwJa6ioW8NEzzNYe5A59jrQAFc1mal9yGMWt1oZH2rtCpy5Crm6JXtkAWVN2zgd+OtFiJtrj26Epp7pDz6FNOaD01ifNeugBa9Jy98mRbmitwagGnkYMM1s5CYdEFq0ukSfXSOdBrfk5MpQ2jCk8DiPz0YsKS8NxjMoPFnsPmy6ho+NLNB4pS+Urd+QS95hzDXfoFnkpRXlr49D6Uvm3h6KXO/Q8+mpgyOupFrZCz98cIWu91GTcoQOwVgdPAaPJnNO6VC6NdIAT4VoVRl4fmfW4Qy91+9QJ9IQUOqDmaDG5O9clC8JxpVQ1Kr93h14rA5AWptDJVuYUs4hsrW3U57yHzZGtVpnrpp4+VfDKQTDwzoGucgOZ0Bj0vFctAdRyDfdI56Gm6i85CPR3jryo3MAkSlJTWrphgbS0TQh0GjG2IDQvXmlC1DqQMnhSo+F8nJy/GOc7Gc7SQC3XC4M+Fu0UsJRLAxq5YV/LW6H0VSAD95ic/TcDqSJBFcNS+phGIM5hQLRGpdZBEsnA5ntpmR6y0+JISwRbbcIinQek0aWlGEiDGoCN1rDUZpNEuOrtys3HZsBRmQvtCoXOA9DFS5GYRrbkQiA5DwdwLpGMrTScnkOE46wxWcExUVHeBfQx8HlpF4BIBg4CMtDJUNhPNJP1aMUujhhbzMR156SgVumw2IVHuh6SqM1fxaVvjSQzaT2diRQOYLAEpKb5Y6t/2T8n/bSAbLHpBrokI9dgrTvX8bm/PeoFeDfykkcJ0YuMpLl1uvCTaAWiZVGqVun29Japq0jP4QNX2izA+m0RkqKFqXnaiS1O0cSodWLVIhVzbLuGrgapvIu0IDcAVTEr/ayft+CsqImPxQmrgJ42hAFVqaKWQOMUspnINNACWzarg97SuF5tN+jbvx7Z/vVISNmzV0lY8rn+AUitgsGin4Z4AAAAAElFTkSuQmCC";
    var view = pageview.extend({

    	tourHomePageModel:tourModel.TourHomePageModel.getInstance(),

    	events:{

    	},

     	onCreate: function() {
     		console.info("into view onCreate...");
            self = this;
        },

        onLoad:function(){
        	console.info("into view onLoad...");
        	
        },

        onShow: function () {
        	console.info("into view onShow...");
        	self.setHead();
        	self.showTourProductList();

        },

        onHide:function(){
        	console.info("into view onHide...");
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

        render:function(){

        },

        showTourProductList:function(){
        	self.tourHomePageModel.param.RequestTypeList=[3];
        	self.tourHomePageModel.param.DepartureCityId=2;
        	self.tourHomePageModel.param.Version =6800;

        	self.tourHomePageModel.excute(function(response){

        		if(response.ResponseStatus && response.ResponseStatus.Ack && response.ResponseStatus.Ack=='Success' && response.Data){

        			var responseData = response.Data || {};
        			
        			var tourProductList = responseData.TourProductList || {};

        			//模板
        			var productTemplate ='<%_.each(data.ProductEntityList, function(v,k){ %>\
                    <li class="border1px_scaley">\
                      <a data-opername="<%=data.opername %>" id="<%=data.ctmStr+(k+1)%>" href="/webapp/tour/detail?productId=<%=v.ProductId %>&saleCityId=<%=data.saleCityId %>&departCityId=<%=v.DepartCityId %>"\
                      data-pid="<%=v.ProductId %>&saleCityId=<%=data.saleCityId %>&departCityId=<%=v.DepartCityId %>" data-sdpid="<%=v.ProductId %>" data-producttype="<%=v.ProductType%>">\
                        <div class="img_box">\
                            <img src="<%if(v.Img && v.Img.trim()){%><%=v.Img%><%}else{%>' + nopic + '<%}%>" alt="<%=v.Title%>">\
                        </div><div class="txt_box">\
                            <h3><%=v.Title%></h3>\
                            <div class="basefix">\
                                <div class="title_list"><%_.each(v.SpecialTagList, function(m,n){ if(n<3){ %><span><%=m.TagName %></span><%}})%></div>\
                                <span class="limited_sale_price"><%if(v.MinPrice){ %><dfn>¥</dfn><strong><%=v.MinPrice%></strong><em>起</em> <%} else {%> 实时计价<%} %></span>\
                            </div></div>\
                      </a>\
                    </li>\
                    <%}) %>';

					var templateData={};
					//出境
					templateData.ProductEntityList = tourProductList.ExternalProductInfoList?tourProductList.ExternalProductInfoList:[];
					templateData.ctmStr = 'ctm_tour_index_external_';
					templateData.opername ='出境跟团游';

					var chujingProductDom = self.$el.find('#ctm_tour_index_external_products');
					chujingProductDom.html(_.template(productTemplate)({data:templateData})).show();
					//console.info(tourProductList);

					//国内
					templateData.ProductEntityList = tourProductList.InternalProductInfoList?tourProductList.InternalProductInfoList:[];
					templateData.ctmStr = 'ctm_tour_index_internal_';
					templateData.opername ='国内跟团游';

					var guoneiProductDom = self.$el.find('#ctm_tour_index_internal_products');
					guoneiProductDom.html(_.template(productTemplate)({data:templateData})).show();
					console.info(guoneiProductDom);

					//周边
					templateData.ProductEntityList = tourProductList.AmbitusProductInfoList?tourProductList.AmbitusProductInfoList:[];
					templateData.ctmStr = 'ctm_tour_index_ambitus_';
					templateData.opername ='周边跟团游';

					var zhoubianProductDom = self.$el.find('#ctm_tour_index_ambitus_products');
					zhoubianProductDom.html(_.template(productTemplate)({data:templateData})).show();

					//隐藏加载div
					var hideDiv = self.$el.find('.base_loading');
					hideDiv.hide();

        		}

        		console.info(response);
        	},function(errorInfo){
        		console.info("tourHomePageModel Ajax error..."+errorInfo);
        	},false,this);

        }

    });


    return view;

});