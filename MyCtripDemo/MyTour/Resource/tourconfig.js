console.info("into tourconfig....");

(function(){
	var baseUrl = Lizard.tourAppBaseUrl+'Resource/';

	var config={

		paths:{
			'TourModel':baseUrl + 'models/TourModel',
			'TourStore':baseUrl +'models/TourStore',
			'TourCommon':baseUrl+'res/scripts/common/tourCommon',
			'Util':baseUrl +'res/scripts/utils/util'

		},

		urlArgs:'v='+(window.tour_version || Date.now()), //后面参数如果是 Date.now() 调试JS设置的断点无效，因为F5刷新之后文件已经刷新了

	};

	require.config(config);
})();