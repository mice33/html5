define(['Util'], function (util) {
    var evn = util.getEnvCode();
    var version = '6.8';
    
    /*
    　自动判断测试环境支付域名
      正常情况下支付平台测试地址根据版本会在fws和fat18之间更替
      如果哪个版本抽风不更替还得手动改
    */
    var testPayUrl = (function(){
        var _ref = version.split('.').slice(0,2).join('+');
        // return eval(_ref)%2 ? 'fws' : 'fat18';
        return 'fws'; //建行APP测试
    })();
    var config = {
        //pageid 用于统计数据 0:h5,1:hybird
        pageid: {
            'index': ['220001','220078'],
            'addresslist': ['220121','401028'],
            'booking_flight': ['220118','401025'],
            'booking_hotel': ['220119','401026'],
            'booking_step1': {
                '11': ['220164', '401072'],
                '10': ['220168', '401076'],
                '9': ['220172', '401080'],
                '26': ['220176', '401084'],
                '25': ['220180', '401088'],
                '12': ['220184', '401092'],
                'diyfhxsdp':['600000788','600000789']
            },
            'booking_step2': {
                '11': ['220165', '401073'],
                '10': ['220169', '401077'],
                '9': ['220173', '401081'],
                '26': ['220177', '401085'],
                '25': ['220181', '401089'],
                '12': ['220185', '401093'],
                'diyfhxsdp':['600000811','600000808']
            },
            'detail_booking_note': ['220127','401034'],
            'detail_booking_process': ['220129','401036'],
            'detail_description':[ '220126','401033'],
            'detail': {
                '11': ['220102', '401019'],
                '10': ['220103', '401020'],
                '9': ['220104', '401021'],
                '25': ['220105', '401022'],
                '26': ['220106', '401023'],
                '12': ['220107', '401024'],
                '13': ['223027', '404027'],
                '33': ['600001565', '600001573'],
                '34': ['600001565', '600001573'],
                '41': ['600001565', '600001573'],
                '42': ['600001565', '600001573'],
                'sale': ['104313', '401007'],
                'route': ['220133', '401040'],
                'privileged': ['220241', '220241'],
                'original': ['220240', '220240'],
                'diyfhxsdp': ['600000785', '600000786']
            },
            'detail_picture_list': ['220131','401038'],
            'detail_question': ['220128','401035'],
            'detail_my_question': ['105116','105216'],
            'detail_visa': ['220130','401037'],
            'detail_hotel': ['600000208', '600000209'],
            'order_contract': ['220124','401031'],
            'order_detail':[ '220132','401039'],
            'order': {
                '11': ['220166', '401074'],
                '10': ['220170', '401078'],
                '9': ['220174', '401082'],
                '26': ['220178', '401086'],
                '25': ['220182', '401090'],
                '12': ['220186', '401094'],
                'diyfhxsdp':['600000812','600000809']
            },
            'order_sback': {
                '11': ['220167', '401075'],
                '10': ['220171', '401079'],
                '9': ['220175', '401083'],
                '26': ['220179', '401087'],
                '25': ['220183', '401091'],
                '12': ['220187', '401095'],
                'fenci':['220256','401142'],
                'diyfhxsdp':['600000813','600000810']
            },
            'order_intention': ['220125','401032'],
            'passengerselect': ['220122','401029'],
            'vacations': ['220008','220085'],
            'grouptravel': {
                'networkerror':['600000254','600000255'],
                'default': ['220002', '220079'],
                'noresult': ['220138', '401045'],
                'pad': ['349004', '349004'],
                'padnoresult': ['349005','349005'],
                'fromtour': ['220262', '401147'],
                'fromtournoresult': ['220263', '401148'],
                'fromtourpad': ['349002', '349002'],
                'fromtourpadnoresult': ['349003', '349003'],
                'networkerror_bpage': ['600000254', '600000255'],
                'default_bpage': ['220002', '220079'],
                'noresult_bpage': ['220138', '401045'],
                'pad_bpage': ['349004', '349004'],
                'padnoresult_bpage': ['349005', '349005'],
                'fromtour_bpage': ['220262', '401147'],
                'fromtournoresult_bpage': ['220263', '401148'],
                'fromtourpad_bpage': ['349002', '349002'],
                'fromtourpadnoresult_bpage': ['349003', '349003'],
                'dailytour': ['600000330', '600000331'],
                'dailytournoresult': ['600000332', '600000333']
            },
            'youxue': ['256001', '257001'],
            'youxuelist': ['256002', '257002'],
            'vacationcity': ['220200', '401107'],
            'addresscreate': ['220207', '401114'],
            //'destination': ['220201', '401108'],
            'detail_leader': ['220202', '401109'],
            'detail_return_cash': ['220203', '401110'],
            'passengeredit': ['220204', '401111'],
            'order_nametip': ['220205', '401112'],
            'order_coupon': ['220206', '401113'],
            'invoice_title_create': ['220210', '401117'],
            'order_route': ['220211', '401118'],
            'order_detail_list': ['220212', '401119'],
            'order_detail_list_info': ['220213', '401120'],
            'order_modification': [['220214', '401121'], ['600001766', '600001765']],
            'order_national': ['220216', '401123'],
            'order_payment': ['220217', '401124'],
            'order_comment': ['220218', '401125'],
            'order_comment_success': ['220219', '401126'],
            'order_comment_add': ['220261', '401146'],
            'invoice_title_list': ['220140', '401047'],
            'footprint': {
                'footprinta': ['220163', '401071'],
                'footprintb': ['600000365', '401071']
            },
            'filterhistory':['600000364','600000364'],
            'order_modification_passenger': ['220215', '401122'],
            'detail_comment': ['220134', '401041'],
            'bargain': ['220238', '401140'],
            'compare_list': ['220239', '401141'],
            'compare_detail': ['220237', '401139'],
            'tours': {
                'networkerror': ['600000252', '600000253'],
                'default': ['105110', '105210'],
                'noresult': ['220263', '401148'],
                'pad': ['104393', '104393'],
                'padnoresult': ['349003','349003']
            },
            'order_pay':['220145','401052'],
            'order_share_login':['600001663', ''],//订单分享只有H5页
            'order_info': ['600001669', '600001670'],
            'international': ['600001842', '600001843']//出境游首页
        },
        //支付地址
        //0:测试地址,1:堡垒地址,2:uat地址,3:生产地址,4:lpt环境
        payMentUrl: ['https://secure.'+ testPayUrl +'.qa.nt.ctripcorp.com', 'https://10.8.5.10', 'https://secure.uat.qa.nt.ctripcorp.com', 'https://secure.ctrip.com', 'https://secure.lpt10.qa.ctripcorp.com'],
        //接口地址 0:测试地址,1:堡垒地址,2:uat地址,3:生产地址,4:lpt环境
        modelUrl : ['http://gateway.m.fws.qa.nt.ctripcorp.com', 'http://10.8.14.28:8080', 'http://gateway.m.uat.qa.nt.ctripcorp.com', 'http://m.ctrip.com', 'http://gateway.m.lpt.qa.nt.ctripcorp.com'],
        //不同环境下的域名
        domains:['http://m.fat67.qa.nt.ctripcorp.com', 'http://m.ctrip.com', 'http://m.uat.qa.nt.ctripcorp.com', 'http://m.ctrip.com', 'http://m.ctrip.com'],
        //安全地址
        httpsUrl:['https://gateway.m.fws.qa.nt.ctripcorp.com','https://sec-m.ctrip.com','https://gateway.m.uat.qa.ctripcorp.com','https://sec-m.ctrip.com','https://gateway.m.lpt.qa.nt.ctripcorp.com'],
        tourTabsUrlMap: {  //tab跳转url
            126: {  //全部
                h5: '/webapp/tour/tours',
                app: 'tours',
                noCross: 1
            },
            64: {   //出发地参团
                h5: '/webapp/tour/grouptravel?type=1',
                app: 'grouptravel?type=1',
                noCross: 1
            },
            512: {  //目的地参团
                h5: '/webapp/tour/grouptravel?type=2',
                app: 'grouptravel?type=2',
                noCross: 1
            },
            2: {    //自由行
                h5: '/webapp/diyfhxsdp/fhxlist?scityid={salecityid}&scitynm={salecityname}&keyword={keyword}',
                app: 'diyfhxsdp/index.html#/webapp/diyfhxsdp/fhxlist?scityid={salecityid}&scitynm={salecityname}&keyword={keyword}'
            },
            4: {    //邮轮
                h5: '/webapp/cruise/search_merge',
                app: 'cruise/index.html#search_merge'
            },
            32: {   //签证
                h5: '',
                app: ''
            },
            '-2': { //当地玩乐
                h5: '',
                app: ''
            },
            '-4': { //门票
                h5: '',
                app: ''
            },
            '-8': { //景+酒 自驾游
                h5: '/webapp/diyshx/tourlist/{salecityid}-{keyword}',
                app: 'diyshx/index.html#/tourlist/{salecityid}-{keyword}'
            },
            '-16': { //鸿鹄逸游
                h5: '',
                app: ''
            },
            8192: { //游学
                h5: '/webapp/tour/youxuelist',
                app: 'youxuelist',
                noCross: 1
            },
            1024: { //一日游
                h5: '/webapp/activity/dailytour/search-dailytour?scityid={salecityid}&dcityid={departcityid}&keyword={keyword}',
                app: 'activity/index.html#/dailytour/search-dailytour?scityid={salecityid}&dcityid={departcityid}&keyword={keyword}',
                poidurl: {
                    h5: '/webapp/activity/dailytour/{keyword}-{poid}?scityid={salecityid}&dcityid={departcityid}&keyword={keyword}',
                    app: 'activity/index.html#/dailytour/{keyword}-{poid}?scityid={salecityid}&dcityid={departcityid}&keyword={keyword}'
                }
            },
            131072: { //公司旅游
                h5: '',
                app: ''
            }
        },
        tourGoDetailPages: { //跳转详情页url
            grouptravel: {  //团队游
                h5: '/webapp/tour/detail?productId={ProductId}&saleCityId={SaleCityId}&departCityId={ProductDepartCityId}',
                app: 'tour/index.html#detail?productId={ProductId}&saleCityId={SaleCityId}&departCityId={ProductDepartCityId}',
                noCross: 0
            },
            activity: {  //一日游
                h5:'/webapp/activity/dest/t{ProductId}.html#ctm_ref=vac_paclst_dl',
                app:'activity/index.html#/dest/t{ProductId}.html?ctm_ref=vac_paclst_dl'
            },
            cruise: {   //邮轮
                h5: '/webapp/cruise/c/{ProductId}.html',
                app: 'cruise/index.html#detail?id={ProductId}'
            },
            diyshx: {   //自驾游
                h5: '/webapp/diyshx/detail/{ProductId}.html',
                app: 'diyshx/index.html#detail/{ProductId}.html'
            },
            diyfhx: {   //自由行
                h5: '/webapp/diyfhxsdp/detail?salecityid={SaleCityId}&departcityid={ProductDepartCityId}&productid={ProductId}',
                app: 'diyfhxsdp/index.html#/webapp/diyfhxsdp/detail?salecityid={SaleCityId}&departcityid={ProductDepartCityId}&productid={ProductId}'
            }
        },
        version: version,
        appVersion: (function(){
            var ver = version.replace(/\./g,'');
            return (ver*Math.pow(10,4-ver.length)).toString();
        })(),
        businessCode:{
            //建行
            CBC:{
                allianceid:19801,
                sid:449843,
                homeUrl:'/webapp/mkt/ccb/djIndex'
            }
        }
    };
    config.tourMoreGoUrlMap={
        '32': { //签证
            h5: '/webapp/tourvisa/visa_list?keyword={keyword}&salecityid={salecityid}&from={from}',
            app: config.domains[evn]+'/webapp/tourvisa/visa_list?keyword={keyword}&salecityid={salecityid}',
            isdirect: 1
        },
        '-2': { //当地玩乐
            h5: '/webapp/activity/dest/k-keyword-0?keyword={keyword}&from=' + location.protocol + '//' + location.host + '{from}',
            app: 'activity/index.html#/dest/k-keyword-0?keyword={keyword}'
        },
        '-4': {    //景点门票
            h5: '/webapp/ticket/dest/k-keyword-0/s-tickets?keyword={keyword}&from=' + location.protocol + '//' + location.host + '{from}',
            app: 'ticket/index.html#/dest/k-keyword-0/s-tickets?keyword={keyword} '
        },
        /**'-16': { //顶级游
            h5: '/webapp/hhtravel/SearchList/{salecityid}/0/k-{keyword}/0/0/0/0/0/0?from={from}',
            app: 'hhtravel/index.html#/webapp/hhtravel/SearchList/{salecityid}/0/k-{keyword}/0/0/0/0/0/0?from={from}'
        }**/
        '-16': { //顶级游
            h5: '/webapp/hhtravel/SearchList/{salecityid}/0/k-{keyword}/0/0/0/0/0/0?from={from}',
            app: config.domains[evn]+'/webapp/hhtravel/SearchList/{salecityid}/0/k-{keyword}/0/0/0/0/0/0',
            isdirect:1
        }
    };
    return config;
})