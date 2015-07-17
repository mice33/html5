// 汉字
define(['cBasePageView', 'res/scripts/util', 'TourStore', 'cWidgetFactory'], function (cBasePageView, util, baseStore, cfactory) {
    var slice = Array.prototype.slice,
        toString = Object.prototype.toString;
    var utilConst = util.CONST;
    var CONST = {
        TYPE_OBJECT: '[object Object]',
        TYPE_ARRAY: '[object Array]'
    };
    var caches = {
        back_forward: null
    };
    var Guider = cfactory.create('Guider');
    //清除store配置
    var viewClearStore = (function () {
        //填写页用到的store
        var orderStore = [baseStore.OrderParamStore, baseStore.OrderDataSaveStore, baseStore.TempPassengerStore];
        return {
            'order.detail': orderStore,
            'order.sback': orderStore
        }
    })();
    //延迟id
    var interval;
    var TourBaseView = cBasePageView.extend({
        //设置view.hasAd属性, 支持下载/唤醒
        hasAd: 1,
        /*
        * 重写 Backbone 的 delegateEvents
        *
        * 让 events 属性，默认可以继承父类的events，而不是覆盖
        *
        * 如果不这样做，又想继承父类的 events 的话，只能把events都写成函数，然后
        *    events: function () {
        *        return util.extendDeep(this.constructor.__super__.events(), {});
        *    }
        */
        delegateEvents: function () {
            var thisEvents = this.events;
            var parentEvents = this.constructor.__super__.events;
            if (parentEvents && thisEvents !== parentEvents) {
                thisEvents = _.isFunction(thisEvents) ? thisEvents.call(this) : thisEvents;
                parentEvents = _.isFunction(parentEvents) ? parentEvents.call(this) : parentEvents;
                this.events = _.extend({}, parentEvents, thisEvents);
            }
            // 调用 Backbone 的 delegateEvents
            return cBasePageView.__super__.delegateEvents.apply(this, arguments);
        },
        //events: {},
        //events: function () { return {} },

        /**
        *  重写 __onLoad
        *
        *  负责调用 onLoad 的一层，直接在这一层处理即可
        *  这样的话，即便有 onLoad 属性，也不会影响 vaOnLoad 被调用
        */
        __onLoad: function (prevViewname) {
            window.vaStorage = this.vaStorage;
            // 调用原本的 __onLoad
            var proto__onLoad_result = cBasePageView.__super__.__onLoad.apply(this, arguments);

            var args = slice.call(arguments),
                storedData;

            // 1. 拿到 vaForward / vaBack 传递的数据
            if (caches.back_forward && caches.back_forward.viewname == prevViewname) {
                storedData = caches.back_forward.data;
            }
            // 2. 拿到 URL 数据
            // URL 的参数合并数据，并覆盖传递的同名参数
            var storedData = _.extend(storedData || {}, util.paramParse());

            // 3. 拿到 localStorage 数据
            var storage_data = this.vaStorage.get();
            // 先把数据合并到一起，但是优先级最低
            storedData = _.extend({}, storage_data, storedData);
            // 同时把数据挂载到一个 storage_data 的名字下面，避免有同名数据被覆盖
            storedData[this.vaStorage.not_store_key] = storage_data;

            args.unshift(storedData);
            if (this.vaOnLoad) {
                // 只能传递一次
                delete caches.back_forward;
                this.vaOnLoad.apply(this, args)
            }
            //清除store
            this.clearStore();
            return proto__onLoad_result;
        },
        //vaOnLoad: function () { },
        vaStorage: util.getStorage('VACATION_TOURE_VIEW'),
        /**
        * @param {Object} [data]
        */
        vaBack: function (data, otherParams) {
            var args = arguments;
            if (toString.call(data) == CONST.TYPE_OBJECT) {
                args = slice.call(arguments, 1);
                caches.back_forward = {
                    viewname: this.viewname,
                    data: data
                };
            }
            return this.back.apply(this, args);
        },
        /*
        tourBack
        @param {object}scope
        为了解决不同环境(h5,hybird,native)，不同app(tour,tourassistant...)之间的跳转
        在同一webapp内，用forward,back
        在h5环境下不同的webapp，用jump
        native跳转hybird,backToLastPage
        hybird跨包cross
        */
        tourBack: function (scope, backpage, newview) {
            var self = scope || this;
            var from = decodeURIComponent(this.queryFrom(location.toString()) || "");
            from = from.substring(from.lastIndexOf("webapp"));
            var pkg = from.match(/\/?(webapp)\/(\w+)\/(\S+)/);
            var isFullPath = /\/?(webapp)\/(\w+)\/(\S+)/.test(from);
            Guider.apply({
                callback: function () {
                    if (!_.isEmpty(from)) {
                        isFullPath ? self.jump('/' + from) : self.back(from);
                    }
                    else {
                        backpage ? self.back(backpage) : self.jump('/webapp/tour/index.html');
                    }
                },
                hybridCallback: function () {
                    //alert(from);
                    if (self.getQuery("from_native_page") == 1) {
                        Guider.backToLastPage();
                    }
                    else if (_.isEmpty(from)) {
                        if (!!newview) {
                            Guider.backToLastPage();
                        }
                        else {
                            backpage ? self.back(backpage) : Guider.backToLastPage();
                        }
                    }
                    else if (!isFullPath) {
                        self.back(from);
                    }
                    else {
                        var path = 'tour', param = 'index.html#index';
                        if (pkg && pkg[3] && pkg[2]) {
                            path = pkg[2];
                            param = pkg[3];
                        }
                        //alert(path + "-----" + param);
                        Guider.cross({
                            path: path,
                            param: param
                        });
                    }
                }
            });
        },
        queryFrom: function (param) {
            var from = '';
            if (param) {
                from = param.match(/from=(\S+)/);
                from = (from && (from.length == 2)) ? from[1] : '';
            }
            return from;
        },
        /**
        * @param {Object} [data]
        */
        vaForward: function (data, otherParams) {
            var args = arguments;
            if (toString.call(data) == CONST.TYPE_OBJECT) {
                args = slice.call(arguments, 1);
                caches.back_forward = {
                    viewname: this.viewname,
                    data: data
                };
            }
            if (!args[0]) throw TypeError("[vaForward] no URL was provided.");

            return this.forward.apply(this, args);
        },
        /**
        * @param {Object} [data]
        */
        vaJump: function (data, otherParams) {
            var args = arguments;
            if (toString.call(data) == CONST.TYPE_OBJECT) {
                args = slice.call(arguments, 1);
                caches.back_forward = {
                    viewname: this.viewname,
                    data: data
                };
            }
            if (!args[0]) throw TypeError("[vaJump] no URL was provided.");

            return this.jump.apply(this, args);
        },
        //update showloading 延迟显示
        /**
        * @param {int} [t]
        */
        vaShowLoading: function (t) {
            interval = setTimeout($.proxy(function () {
                this.showLoading();
            }, this), t || 300);
        },
        vaHideLoading: function () {
            interval && clearTimeout(interval);
            this.hideLoading()
        },
        _storageInStep: [{
            name: utilConst.STORE_DETAIL,
            contain: []
        }, {
            name: utilConst.STORE_BOOKING_STEP1,
            contain: [utilConst.STORE_BOOKING_CALENDAR, utilConst.STORE_BOOKING_STEP1]
        }, {
            name: utilConst.STORE_BOOKING_STEP2,
            contain: [utilConst.STORE_BOOKING_STEP2, utilConst.STORE_BOOKING_CHOOSED_RESOURCE,
                utilConst.STORE_BOOKING_HOTEL, utilConst.STORE_BOOKING_SINGLE, utilConst.STORE_BOOKING_OPTIONAL, utilConst.STORE_BOOKING_TMP_ORDER
            //, utilConst.STORE_BOOKING_GUID
            ]
        }, {
            name: utilConst.STORE_BOOKING_STEP3,
            contain: []
        }],
        //storageCleaner: function(currentStepName) {
        //    var vaStorage = this.vaStorage;
        //    var find = false;
        //    _.each(this._storageInStep, function(entity) {
        //        if (find) {
        //            _.each(entity.contain, function(storageKey) {
        //                vaStorage.remove(storageKey);
        //            });
        //        }
        //        // 当前步骤之后的全部清除
        //        else if (entity.name == currentStepName) {
        //            find = true;
        //        }
        //    });
        //},
        util: util,
        clearStore: function () {
            var str, hash = location.hash.slice(1);
            if (!hash) {
                return;
            }
            var view = hash.split('?')[0];
            if (str = viewClearStore[view]) {
                if (toString.call(str) === CONST.TYPE_ARRAY) {
                    for (var i = 0, len = str.length; i < len; i++) {
                        (str[i].getInstance()).remove();
                    }
                } else {
                    (str.getInstance()).remove();
                }
            }
        },
        isIOS: !!$.os && !!$.os.iphone
    });
    return TourBaseView;
});