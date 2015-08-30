define(['cModel','cCoreInherit','TourStore','Util','cUtilCommon','TourCommon'],function(cModel,cBase,store,util,cUtilCommon,tourCommon){

	var evn = util.getEnvCode();

	var apiEvn;

	var _ret ={};

	var setModel= function(obj){
		var isSelfModel = obj.url.indexOf('10124') > -1;
        return new cBase.Class(cModel, {
            __propertys__: function() {
                //判断是否需要多个环境
                /**测试暂时的代码结束*/
                var url = isSelfModel && apiEvn ? obj.url + apiEvn : obj.url;
                this.param = {};
                this.domain = (evn === 3 && obj.protocol === 'https' ? tourCommon.httpsUrl : tourCommon.modelUrl)[evn];
                this.path = '/restapi/soa2/';
                for(var _i in obj){
                    this[_i] = obj[_i];
                }
                this.url = this.domain + this.path + url;
                //给我们自己的model增加统一的参数
                isSelfModel && function(excute) {
                    this.excute = function() {
                        this.result = this.result && this.result.getInstance();
                        this.param.Version = tourCommon.appVersion;
                        this.param.PlatformId = cUtilCommon.isInApp ? 0 : 1;
                        return excute.apply(this, arguments);
                    }
                }.call(this, this.excute);
            }
        })
	};


	_ret.TourHomePageModel = {
		url:'10124/TourHomePage'
	};

	return function(){
            var _ref;
            for (var i in _ret) {
                _ref = _ret[i];
                if (!_ref.domain || !_ref.path) {
                    _ref.url += '.json';
                }
                _ret[i].getInstance = (function(x) {
                    return x.getInstance.bind(x);
                })(setModel(_ret[i]));
            }
            return _ret
        }();

});