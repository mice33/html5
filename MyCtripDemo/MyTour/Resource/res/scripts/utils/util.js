define(['cUtilHybrid','TourStore'], function (cUtilHybrid,TourStore) {
    var util = {};
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var storeKeyArray = TourStore.storeKeyArray;
    var CONST = util.CONST = {
        OBJECT_DATE: '[object Date]',
        OBJECT_STRING: '[object String]',
        OBJECT_OBJECT: '[object Object]',
        OBJECT_ARRAY: '[object Array]',

        STORE_DETAIL: 'detail',
        STORE_DETAIL_RETURN_CASH: 'detail.return.cash',
        STORE_DETAIL_LINE_INFO: 'detail.line.info',
        STORE_DETAIL_BACK_LIST: 'detail.back.list',
        STORE_DETAIL_PRIVILEGED_POP: 'detail.privileged.pop',
        STORE_DETAIL_HOTEL_LIST: 'detail.hotel.list',
        STORE_DETAIL_SCENIC_LIST: 'detail.scenic.list',
        STORE_BOOKING_CALENDAR: 'select.calendar',
        STORE_BOOKING_STEP1: 'booking.step1',
        STORE_BOOKING_STEP2: 'booking.step2',
        STORE_BOOKING_CHOOSED_RESOURCE: 'booking.choosed.resource',
        STORE_BOOKING_HOTEL: 'booking.hotel',
        STORE_BOOKING_SINGLE: 'booking.single',
        STORE_BOOKING_OPTIONAL: 'booking.optional',
        STORE_BOOKING_GUID: 'booking.guid.manager',
        STORE_BOOKING_TMP_ORDER: 'booking.tmp.order',
        STORE_BOOKING_STEP3: 'booking.step3',
        STORE_ORDER_DETAIL_OPTION: 'order.detail.option'
    };

    //方法扩展.
    if(!Function.prototype.bind){
        Function.prototype.bind = function(){
            if(typeof this !== 'function'){
                throw 'type error';
            }
            var _Fn = this;
            var _args = slice.call(arguments);
            var _scope = _args.shift();
            return function(){
                _Fn.apply(_scope,_args.concat(slice.call(arguments)));
            }
        }
    }
    //////////////////////////// 
    //////////////////////////// int
    //////////////////////////// 
    var int = util.int = function (num) {
        return parseInt(num, 10);
    };

    //////////////////////////// 
    //////////////////////////// getPath
    //////////////////////////// 
    // 页面路径配置
    var pathConfig = {
        // 搜索结果 列表页
        search_list: 'vacationslist',
        // 详情页
        detail: 'detail',
        // 详情页出发班期与价格日历
        detail_select_calendar: 'select.calendar',
        // 详情页返现说明
        detail_return_cash: 'detail.return.cash',
        // 详情页预订须知
        detail_booking_note: 'detail.booking.note',
        // 详情页签证签注
        detail_visa: 'detail.visa',
        // 选择日期
        select_calendar: 'select.calendar',
        // 详情页，图片列表
        detail_picture_list: 'detail.picture.list',
        // 详情页，图片详情
        detail_picture_detail: 'detail.picture.detail',
        // 预定，第一步
        booking_step1: 'booking_step1',
        // 预定页，第二步
        booking_step2: 'booking_step2',
        // 预定页，重选酒店
        booking_select_hotel: 'booking_hotel',
        // 预定页，重选单选资源
        booking_select_single: 'booking.select.single',
        // 预定页，重选可选资源
        booking_select_optional: 'booking.select.optional',
        // 预定，第三步，下订单
        order: 'order',
        // 意向单
        order_intention: 'order_intention',
        // 订单详细，详细行程
        order_route: 'order.route',
        // 订单详细，订单明细
        order_detail_list: 'order_detail_list',
        // 订单详细，订单明细，详情
        order_detail_list_info: 'order.detail.list.info'
    };
    /**
    * @param {String} pageName
    * @param {Object} params
    * @param {Boolean} needHash
    *
    * @return {String}
    */
    util.getPath = function (pageName, params, needHash) {
        if (_.isUndefined(needHash)) needHash = false;
        var path = pathConfig[pageName] || '';
        return (needHash ? '#' : '') + path + util.paramStringify(params);
    };
    /**
    * @param {Object} params
    * @param {Boolean} questionMark
    *
    * @return {String}
    */
    util.paramStringify = function (params, questionMark) {
        if (!params) return '';
        if (_.isUndefined(questionMark)) questionMark = true;
        var paramKeys = _.keys(params), paramsLen = paramKeys.length, path = '';
        _.each(paramKeys, function (key, i) {
            // 先处理一遍日期
            var value = util.date.stringify(params[key]);
            if (_.isUndefined(value)) value = '';
            if (questionMark && i == 0) path += '?';
            path += key + '=' + value;
            if (i != paramsLen - 1) path += '&';
        });
        return path;
    };

    /**
    * @param {String} paramString
    *
    * @return {Object}
    */
    var REG_HASH_QUERY = /.*?\?(.*)/;
    var paramCache = {};
    util.paramParse = function (paramString) {
        if (!paramString) {
            var hash = location.hash;
            paramString = hash.substr(1).match(REG_HASH_QUERY);
            paramString = paramString && paramString[1];
            if (!paramString) return {};
        }
        if (!paramCache[paramString]) {
            var result = {};
            _.each(paramString.split('&'), function (pair) {
                var kv = pair.match(/([^=]+)=?(.*)/);
                var value = kv[2], tmpValue = parseFloat(value);
                // 处理 Number 类型数据
                if (tmpValue + '' == value) {
                    value = tmpValue;
                }
                // 处理 Date 类型数据
                value = util.date.parse(value);

                result[kv[1]] = value;
            });
            paramCache[paramString] = result;
        }
        return paramCache[paramString];
    };


    //////////////////////////// 
    //////////////////////////// assert
    //////////////////////////// 参考：http://nodejs.org/api/assert.html
    //////////////////////////// 
    util.assertError = function (message) {
        var assertErrorPrefix = "[Assertion failed] ";
        throw assertErrorPrefix + (message || "");
    };

    util.assert = function (value, message) {
        if (!value) util.assertError(message);
    };

    util.assertEqual = function (actual, expected, message) {
        if (actual != expected) util.assertError(message);
    };

    util.assertNotEqual = function (actual, expected, message) {
        if (actual == expected) util.assertError(message);
    };

    util.assertDeepEqual = function (actual, expected, message) {
        if (actual !== expected) util.assertError(message);
    };

    util.assertNotDeepEqual = function (actual, expected, message) {
        if (actual === expected) util.assertError(message);
    };




    //////////////////////////// 
    //////////////////////////// ensure 保证数据全部存在
    //////////////////////////// 
    function notEmpty(o) {
        var type = toString.call(o);
        return o !== undefined && o !== null
            && (type == CONST.OBJECT_OBJECT || type == CONST.OBJECT_ARRAY ? !_.isEmpty(o) : true);
    }
    util.ensureAll = function (data, ensureKeys) {
        return data && _.every(ensureKeys, function (key) { return notEmpty(data[key]) }); //{ return data[key] !== undefined && data[key] !== null });
    };

    util.ensureSome = function (data, ensureKeys) {
        return data && _.some(ensureKeys, function (key) { return notEmpty(data[key]) });
    };



    //////////////////////////// 
    //////////////////////////// ensure 保证数据全部存在
    //////////////////////////// 
    util.copyJSON = function (jsonableData) {
        return JSON.parse(JSON.stringify(jsonableData));
    };




    //////////////////////////// 
    //////////////////////////// date 处理日期
    //////////////////////////// 
    var defaultPrefix = '_dd';
    var defaultPostfix = 'dd_';
    util.date = {
        /*
        @param {Date} date

        @return {String}

        @eg stringify(date, '_dd', 'dd_') => '_dd1395331200000dd_'
        */
        stringify: function (date, prefix, postfix) {
            prefix = prefix || defaultPrefix;
            postfix = postfix || defaultPostfix;
            // 日期
            if (toString.call(date) == CONST.OBJECT_DATE) {
                return prefix + date.getTime() + postfix;
            }
            else {
                return date;
            }
        },
        /*
        @param {String} dateStr

        @return {Date}

        @eg parse('_dd1395331200000dd_', '_dd', 'dd_') => date
        */
        parse: function (dateStr, prefix, postfix) {
            prefix = prefix || defaultPrefix;
            postfix = postfix || defaultPostfix;
            var reg = new RegExp('^' + prefix + '\\d+' + postfix + '$');
            if (_.isString(dateStr) && dateStr.match(reg)) {
                return new Date(util.int(dateStr.substr(prefix.length, dateStr.length - (prefix.length + postfix.length))));
            }
            else {
                return dateStr;
            }
        },

        /*
        @param {String} dateStr

        @return {String}

        @eg transform("/Date(1395331200000+0800)/") => '2014-03-21'
        */
        transform: function (dateStr,format) {
            var match = dateStr.match(/^\/Date\((\d+)(\+|-)\d+\)\/$/);
            if (match) {
                var timestamp = util.int(match[1]);
                return util.calendar.format(new Date(timestamp),format);
            }
            else {
                return dateStr;
            }
        },
        /*
        转换为js可识别的时间戳
        @eg transform("/Date(1395331200000+0800)/") => 1395331200000
        */
        transformTimeStamp: function (dateStr) {
            var match = dateStr.match(/^\/Date\((\d+)\+\d+\)\/$/);
            if (match) {
                return match[1] - 0;
            }
            else {
                return dateStr;
            }
        },
        /**
		 * format日期，由于返回的date是C# dateTime对象，需要转换成标准日期
		 * @param  {string} date 类似"/Date(1400121031082+0800)/"字符串
		 * @return {[string]}      类似"2014年5月27日"
		 */
        _formatDate: function (date) {
            date = new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
            date = [date.getFullYear(), '年', date.getMonth() + 1, '月', date.getDate(), '日'].join('');
            return date;
        },
        _formatDateNew: function(date){
            var oDate = new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
            var sHours = oDate.getHours() > 9 ? oDate.getHours() : '0' + oDate.getHours();
            var sMinutes = oDate.getMinutes() > 9 ? oDate.getMinutes() : '0' + oDate.getMinutes();
            return oDate.getFullYear() + '-' + (oDate.getMonth() + 1) + '-' + oDate.getDate() + ' ' + sHours + ':' + sMinutes;
        },
        _formatWeek: function(date){
            var sDate = date.split('-');
            var oDate = new Date(sDate[0], parseInt(sDate[1]) -1, sDate[2]);
            var week;
            switch(oDate.getDay()){
                case 0 :
                    week = '日';
                    break;
                case 1:
                    week = '一';
                    break;
                case 2:
                    week = '二';
                    break;
                case 3:
                    week = '三';
                    break;
                case 4:
                    week = '四';
                    break;
                case 5:
                    week = '五';
                    break;
                case 6:
                    week = '六';
                    break;
            }
            return week;
        },
        _formatChineseDate: function(date){
            var oDate = date.split('-');
            return oDate[0] + '年' + parseInt(oDate[1],10) + '月' + parseInt(oDate[2],10) + '日';
        }
    };



    //////////////////////////// 
    //////////////////////////// getStorage 拿到一个localStorage，在一个名字空间内
    //////////////////////////// 
    var StorageVACache = {};
    var StorageVA = function (KEY_IN_LOCAL_STORAGE) {
        this.KEY = KEY_IN_LOCAL_STORAGE;
        this.storage = window.localStorage;
        this.not_store_key = 'storage_data';
    };
    StorageVA.prototype._getStore = function () {
        var store = this.storage.getItem(this.KEY);
        return store ? JSON.parse(store) : {};
    };
    /*
    @param {String} [key]

    @return {Map|Value}
    */
    StorageVA.prototype.get = function (key) {
        var store = this._getStore();
        _.each(store, function (value, key) {
            // 日期
            store[key] = util.date.parse(value);
        });
        return _.isUndefined(key) ? store : store[key];
    };
    /*
    @param {String} key
    @param {*} value

    @eg set(key, value)
    @eg set(map{Object}, exceptKey[Array])
    */
    StorageVA.prototype.set = function (key, value) {
        var store = this._getStore();
        if (toString.call(key) == CONST.OBJECT_OBJECT) {
            var map = _.extend(store, key), exceptKey = value || [];
            exceptKey.push(this.not_store_key);
            // 1. 处理需要排除的
            _.each(exceptKey, function (key, index) {
                delete map[key];
            });
            // 2. 数据类型的处理
            _.each(map, function (value, key) {
                // 日期
                map[key] = util.date.stringify(value);
            });
            this.storage.setItem(this.KEY, JSON.stringify(map));
        } else if (key != this.not_store_key) {
            store[key] = value;
            this.storage.setItem(this.KEY, JSON.stringify(store));
        }
        return this;
    };

    StorageVA.prototype.setAttr = function (key, value) {
        var store = this._getStore();

        if (_.isObject(value)) {
            _.extend(store[key], value)
        } else {
            store[key] = value;
        }
        this.storage.setItem(this.KEY, JSON.stringify(store));
    }

    StorageVA.prototype.remove = function (key) {
        var store = this._getStore();
        delete store[key];
        this.storage.setItem(this.KEY, JSON.stringify(store));
        return this;
    };
    StorageVA.prototype.clear = function () {
        this.storage.removeItem(this.KEY);
        return this;
    };
    util.getStorage = function (suffix) {
        //带key值得store要控制数量
        var key = 'VACATION_TOURE_VIEW';
        var _ref = storeKeyArray.getAttr(key) || [];
        if(suffix){
            if(_.indexOf(_ref,suffix) === -1){
                if(_ref.length===5){
                  window.localStorage.removeItem(key+_ref.shift());
                }
                 _ref.push(suffix);
                storeKeyArray.setAttr(key,_ref);
            }
            key+=suffix;
        }
        if (!StorageVACache[key]) {
            StorageVACache[key] = new StorageVA(key);
        }
        return StorageVACache[key];
    };


    //////////////////////////// 
    //////////////////////////// memoryCache
    //////////////////////////// 
    util.cache = {
        _cache: {},
        get: function (name) {
            return this._cache[name];
        },
        set: function (name, value) {
            this._cache[name] = value;
            return this;
        },
        remove: function (name) {
            delete this._cache[name];
            return this;
        }
    };

    /*
    * @param {String} str
    * @param {Number} len
    * @param {String} fill
    * @param {Boolean} pre
    * @example pad('1', 3, '0', true) ==> '001'
    * @example pad('1', 3, '-') ==> '1--'
    */
    var pad = util.pad = function (str, len, fill, pre) {
        str = str.toString();
        if (str.length < len) {
            fill = (new Array(len)).join(fill || ' ');
            if (pre) {
                str = (fill + str).substr(-len);
            } else {
                str = (str + fill).substring(0, len);
            }
        }
        return str;
    };

    util.calendar = {
        /*
        * @param {String} str 2014-01-01
        */
        strToDate: function (str) {
            if (str instanceof Date || !str) return str;

            var arr = str.split('-'), year, month, day;
            if (arr.length != 3 || !(year = int(arr[0])) || !(month = int(arr[1])) || !(day = int(arr[2]))) return str;
            return new Date(year, month - 1, day);
        },
        /*
        * @param {Date | Number} date|month
        */
        getFullMonth: function (date) {
            return int(date instanceof Date ? date.getMonth() : date) + 1;
        },
        /*
        * @param {Date | String} date '2014-03-02'
        * @param {String} [format = 'yyyy-mm-dd'] 'yyyy-mm-dd HH:MM:ss'
        */
        format: function (date, format) {
            if (!(date = util.calendar.strToDate(date))) return date;
            format = format || 'yyyy-mm-dd';

            date = format.replace(/y+|m+|d+|H+|M+|s+/g, function (match) {
                var firstChar = match.substr(0, 1),
                    len = match.length;
                switch (firstChar) {
                    case 'y':
                        return date.getFullYear().toString().substr(4 - len);
                    case 'm':
                        return pad(date.getMonth() + 1, len, '0', true);
                    case 'd':
                        return pad(date.getDate(), len, '0', true);
                    case 'H':
                        return pad(date.getHours(), len, '0', true);
                    case 'M':
                        return pad(date.getMinutes(), len, '0', true);
                    case 's':
                        return pad(date.getSeconds(), len, '0', true);
                }
            });
            return date;
        }
    };


    util.helper = {
        /*
        @param {Date|DateString} date
        @param {Number} type []
        */
        dateFormat: function (date, type) {
            if (_.isUndefined(type)) type = 1;
            if (toString.call(date) == CONST.OBJECT_DATE) {
                date = util.date.stringify(date);
            }
            var tmp, result;
            // 2014-03-02 => 03月02日
            if (type == 1) {
                tmp = date.split('-');
                result = tmp[1] + '月' + tmp[2] + '日';
            }
            return result;
        },
        strdate: function (str) {
            return typeof str === 'string' ? new Date(Date.parse(str.replace(/-/g, '/'))) : str;
        }
    };
    //获取当前域名
    //return 0,1,2 测试/堡垒/生产
    util.getEnvCode = function () {
        var host = location.host;
        if (cUtilHybrid && cUtilHybrid.isInApp) {
            //return cUtilHybrid.isPreProduction(); //1、定义堡垒环境 0、定义测试环境 2、uat环境  其他：生产环境
            var pre = parseInt(cUtilHybrid.isPreProduction());
            return isNaN(pre) || [0, 1, 2, 4].indexOf(pre) < 0 ? 3 : pre;
        }
        if (host.match(/m\.fat/i) || host.match(/^(localhost|10\.32)/i) || host.match(/^(192\.168\.253\.1)/i)) { //0测试
            //return 0;
            return 3;
        } else if (host.match(/^(10\.8)/i)) { //堡垒
            return 1;
        } else if (host.match(/^m\.uat/i)) { //uat
            return 2;
        } if (host.match(/m\.lpt/i)) {//Lpt
            return 4;
        } else {
            return 3; //生产
        }
    };
    util.fixInertia = function (view) {
        var self = view;
        //一张1*1的透明图片
        var nonpic_1_1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAA1JREFUGFdj+P//PwMACPwC/ohfBuAAAAAASUVORK5CYII=';
        var newImage = '<img src="' + nonpic_1_1 + '" alt=""/>';
        var newImages = [newImage, newImage, newImage];
        var fixInertiaHTML = '<div class="nonpic" style="display:none">' + newImages.join('') + '</div>';
        self.$el.append(fixInertiaHTML);
        //此事件必须等页面上渲染了img节点之后，再进行更改src属性，所以加延时
        setTimeout(function () {
            var $images = self.$el.find('.nonpic img');
            $images.each(function (index, element) {
                $(element).attr('src', '');
            });
        }, 13);
    };
    //url后面增加参数
    //param {url:key:val}
    util.urlAppendArg = function  (param) {
        if(!param){
            return '';
        }
        var _ref;
        var reg = new RegExp('(?:^|\\?|&)('+ param.key +'=\\w*)(?:&|$)','i');
        if(_ref = param.url.match(reg)){
            param.url.replace(_ref[1],'');
        }
        var segChar = param.url.indexOf('?')>-1 ? "&":'?' ;
        return [param.url,segChar,param.key+'='+param.val].join('');
    };
    return util;
});
