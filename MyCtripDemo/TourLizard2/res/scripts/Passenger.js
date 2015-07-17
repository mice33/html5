define(['libs', 'c', 'TourModel', 'TourStore', 'CommonStore', 'cUIScrollRadioList', 'cUIScrollRadio', 'res/scripts/utils/ParseID', 'res/data/orderdata', 'res/data/nationaldata', 'cUIAlert']
, function (libs, c, model, store, commonstore, radioList, radio, ParseID, commonData, nationaldata, uiAlert) {
    var Passenger = {};
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var _model = model.PassengersModel.getInstance();
    var orderParam = store.OrderParamStore.getInstance();
    var passengerEditStore = store.PassengerEditStore.getInstance(),
        passengerEditModel = model.PassengerEditModel.getInstance(),
        orderdata = store.OrderDataSaveStore.getInstance(),
        TempPassengerStore = store.TempPassengerStore.getInstance(),
        userStore = commonstore.UserStore.getInstance();

    //国籍的初始
    Passenger.ndata = (function () {
        var ndata = {};
        $.map(nationaldata.all.split('@'), function (v, k) {
            _ret = v.split('|');
            ndata[_ret[2]] = _ret;
        });
        return ndata;
    })();
    //获得用户信息
    Passenger.userInfo = userStore ? userStore.getUser() : null;

    Passenger.isLogin = userStore.isLogin();

    Passenger.DataControlPE = {
        BaseInfo: {
            "InfoID": "",
            "PassengerType": "",
            "CNName": "",
            "ENFirstName": "",
            "ENMiddleName": "",
            "ENLastName": "",
            "UpdatedDate": "",
            "Birthday": "",
            "Gender": "",
            "NationalityName": "",
            "NationalityCode": "",
            "CityName": "",
            "DetailAddress": "",
            "PostCode": "",
            "MobilePhone": "",
            "ContactTel": "",
            "ContactFax": "",
            "ContractEmail": "",
            "MobilePhoneHK": "",
            "MobilePhoneForeign": "",
            "CorpCustID": null,
            "ConfirmType": 'CSM',
            "ContractUpdateDate": "",
            "Passport_signDate": "",
            "IsFlt": "",
            "PhoneCountryfix": "",
            "CurCountry": null,
            "MobileCountryfix": "",
            "IsENName": "",
            "BirthPlace": "",
            "ShortMobilePhone": "",
            "BookingUser": "",
            "MemberUserInfoTime": [],
            "MemberUserInfoUsage": [],
            "MemberUserFFPInfos": [],
            "MemberUserIDCardInfos": []
        }
    };

    Passenger.template = Passenger.template || {};
    Passenger.template.getOrderTemp = function (orderid) {
        var tmpOrdID = orderid || 0;
        _model.setParam('tmpOrdID', id);
        _model.excute(function (data) {
            if (data.errno === 0) {

            } else {
                //this.showToast('出现错误');
                //_this.vaHideLoading();
            }
        }, function () { }, false, this);
    };

    //格式化旅客模板
    Passenger.template.formatCustomTpl = function (tpl) {
        var self = this;
        var ret = {};
        var _ret = {
            iCdInf: []
        };
        var infoType = 'name|cNm|eNm|ntl|iCdtp|icdNo|icdVdt|gd|btd|hmPc|mbp';
        //字段对应关系
        var corres = {
            'UserName': 'name',
            'ChineseName': 'cNm',
            'EnglishName': 'eNm',
            'Nationality': 'ntl',
            'IDType': 'iCdtp',
            'IDNumber': 'icdNo',
            'CardValidUntil': 'icdVdt',
            'Sex': 'gd',
            'Birthday': 'btd',
            'BirthPlace': 'hmPc',
            'ContactPhone': 'mbp'
        };
        var objIdCards = {};
        $.map(infoType.split('|'), function (v, k) {
            _ret[v] = '';
        });
        $.map(tpl.CustomerInfoItemList, function (v, k) {
            if (v.CustomerInfoItemModel === 1) {
                _ret[corres[v.CustomerInfoItemType]] = v;
            } else {
                if (v.CustomerInfoItemType == 1 && v.Note) { //身份证特殊提示
                    _ret.restrictions = v.note;
                }
                //orderParam.setAttr('objIdCards', self.objIdCards[v.iType] = v);
                objIdCards[v.CustomerInfoItemType] = v;
                _ret.iCdInf.push(v);
            }
        });
        if (_ret.iCdInf.length) this.idCards = _ret.iCdInf;
        orderParam.setAttr('customTpl', _ret);
        orderParam.setAttr('objIdCards', objIdCards);
        ret._ret = _ret;
        ret.objIdCards = objIdCards;
        return ret;
    };

    //***************************************************************************************************//
    Passenger.edit = Passenger.template || {};
    Passenger.comment = Passenger.comment || {};

    Passenger.edit.init = function (param) {
        var pageParam = orderParam.get();
        var ret = {};
        //var natl;
        //出生日期的索引
        var birthIndex = '50-0-0';
        var vdtIndex = '0-0-0';
        var idindexs = [];
        var dfID; //默认的证件
        var psgIcdInf = null;
        if (param.customTpl.iCdInf && param.customTpl.iCdInf.length > 0) {
            var cardinfo = [];
            for (var i = 0, j = param.customTpl.iCdInf.length; i < j; i++) {
                cardinfo[i] = {};
                for (var key in param.customTpl.iCdInf[i]) {
                    cardinfo[i][key] = param.customTpl.iCdInf[i][key];
                }
            }
            var idCardsArr = $.map(cardinfo, function (v, k) {
                idindexs.push(+v.CustomerInfoItemType);
                return Passenger.comment.updateKey(v, {
                    'Name': 'val',
                    'CustomerInfoItemType': 'key'
                });
            });
            //把用户的证件数组转化成对象
            if (param.psg.MemberUserIDCardInfos) {
                psgIcdInf = Passenger.comment.getPsgIdObj(param.psg.MemberUserIDCardInfos);
            }
            dfID = Passenger.comment.getIdCard(param.psg, idindexs, pageParam, psgIcdInf);
        }
        if (param.psg.Birthday) {
            var _ref = Passenger.comment.dateformat(param.psg.Birthday).split('-');
            var arrs = Passenger.comment.getRangeDate(1930, param.theDate.getFullYear(), !0);
            var yindex = _.indexOf(arrs[0], +_ref[0]);
            birthIndex = [yindex == -1 ? 50 : yindex, _.indexOf(arrs[1], +_ref[1]), _.indexOf(arrs[2], +_ref[2])].join('-');
        }
        if (dfID && dfID.IDCardTimelimit) {
            var year = param.theDate.getFullYear();
            var vdt_ref = Passenger.comment.dateformat(dfID.IDCardTimelimit).split('-');
            var vdt_arrs = Passenger.comment.getRangeDate(year, year + 50, !0);
            var yindex = _.indexOf(vdt_arrs[0], +vdt_ref[0]);
            vdtIndex = [yindex == -1 ? 50 : yindex, _.indexOf(vdt_arrs[1], +vdt_ref[1]), _.indexOf(vdt_arrs[2], +vdt_ref[2])].join('-');
        }
        //国籍
        if (natl = pageParam.national) {
            param.psg.NationalityCode = natl.val;
            param.psg.NationalityName = natl.name;
            orderParam.removeAttr('national');
        } else if (param.psg.NationalityCode && $.trim(param.psg.NationalityCode)) {
            param.psg.NationalityName = Passenger.ndata[param.psg.NationalityCode][1];
        }
        ret.idCardsArr = idCardsArr;
        ret.psgIcdInf = psgIcdInf;
        ret.passengerInfo = param.psg;
        ret.birthIndex = birthIndex;
        ret.vdtIndex = vdtIndex;
        ret.idindexs = idindexs;
        ret.dfID = dfID;
        return ret;
    };


    //重置常旅主题信息
    Passenger.comment.resetInfo = function () {
        return BaseInfo = {
            "InfoID": "",
            "PassengerType": "",
            "CNName": "",
            "ENFirstName": "",
            "ENMiddleName": "",
            "ENLastName": "",
            "UpdatedDate": "",
            "Birthday": "",
            "Gender": "",
            "NationalityName": "",
            "NationalityCode": "",
            "CityName": "",
            "DetailAddress": "",
            "PostCode": "",
            "MobilePhone": "",
            "ContactTel": "",
            "ContactFax": "",
            "ContractEmail": "",
            "MobilePhoneHK": "",
            "MobilePhoneForeign": "",
            "CorpCustID": null,
            "ConfirmType": 'CSM',
            "ContractUpdateDate": "",
            "Passport_signDate": "",
            "IsFlt": "",
            "PhoneCountryfix": "",
            "CurCountry": null,
            "MobileCountryfix": "",
            "IsENName": "",
            "BirthPlace": "",
            "ShortMobilePhone": "",
            "BookingUser": "",
            "MemberUserInfoTime": [],
            "MemberUserInfoUsage": [],
            "MemberUserFFPInfos": [],
            "MemberUserIDCardInfos": []
        }
    };

    Passenger.comment.updateKey = function (obj, keys) {
        for (var key in keys) {
            if (key in obj) {
                obj[keys[key]] = obj[key];
                delete obj[key];
            }
        }
        return obj;
    }

    Passenger.comment.getPsgIdObj = function (idcards) {
        var _ret = {};
        if (!idcards || !idcards.length) {
            return false;
        }
        $.each(idcards, function (k, v) {
            _ret[v.IDCardType] = v;
        });
        return _ret;
    }

    Passenger.comment.getIdCard = function (info, ids, store, psgIcdInf) {
        var _ret = {
            'IDCardType': ids[0],
            'IDCardTimelimit': '',
            'IDCardNo': ''
        };
        //var psgIcdInf = this.psgIcdInf;
        if (!ids) {
            this.showToast('数据出错！');
            return false;
        }
        if (store.psdEdit && info.MemberUserIDCardInfos && info.MemberUserIDCardInfos.length) {
            orderParam.removeAttr('psdEdit');
            $.each(info.MemberUserIDCardInfos, function (k, v) {
                if (_.indexOf(ids, v.IDCardType) !== -1) {
                    _ret = v;
                    return false;
                }
            });
            return _ret;
        }
        if (info.tempDefaultIdType) {
            return psgIcdInf[info.tempDefaultIdType];
        }
        if (info.defaultIdType && psgIcdInf) {
            return psgIcdInf[info.defaultIdType];
        }
        //根据产品类型确定证件类型
        var ptype = store.oorder ? store.oorder.ptype : "";
        if (ptype) {
            if (ptype == 1) {
                if (_.indexOf(ids, 1) !== -1) {
                    if (psgIcdInf && psgIcdInf[1]) {
                        return psgIcdInf[1];
                    } else {
                        _ret.type = 1;
                        return _ret;
                    }
                } else {
                    return _ret;
                }
            } else if (ptype == 2 || ptype == 3) {
                if (_.indexOf(ids, 2) !== -1 || _.indexOf(ids, 3) !== -1) {
                    if (psgIcdInf && psgIcdInf[2]) {
                        return psgIcdInf[2];
                    } else {
                        _ret.type = 2;
                        return _ret;
                    }
                } else {
                    return _ret;
                }
            }
        }
        return _ret;
    };

    Passenger.comment.getRangeDate = function (star, stop, bl) {
        var fn = function (start, stop, str) {
            return _.map(_.range(start, stop), function (arg, k) {
                // arg = arg.length == 1 ? ('0' + arg) : arg;
                return bl ? arg : {
                    key: arg,
                    val: arg + str
                }
            })
        };
        var y = fn(star, stop, '年');
        var m = fn(1, 13, '月');
        var d = fn(1, 32, '日');
        return [y, m, d];
    };

    Passenger.comment.dateformat = function (str) {
        var ret, tempdate;
        if (str && str.indexOf('/') > -1) {
            var mystr = str.replace(new RegExp("\/", "g"), '');
            var re = /Date\((\S+)\)/ig;
            tempdate = new Date(parseInt((re.exec(mystr)[1]), 10));
            ret = tempdate.getFullYear() + "-" + (tempdate.getMonth() + 1) + "-" + tempdate.getDate();
        } else {
            ret = str;
        }
        return ret;
    };

    //校验填写项
    Passenger.comment.cReg = (function () {
        return {
            hasCnChar: function (str) {
                return /[\u0100-\uffff]/.test(str);
            },
            isCnChar: function (str) {
                return /^[\u4e00-\u9fa5]+$/.test(str);
            },
            isEnChar: function (str) {
                return /^[A-Za-z][A-Za-z\s]*[A-Za-z]$/.test(str);
            },
            isEnName: function (str) {
                return /^[^\/]+\/[^\/]+$/.test(str);
            },
            hasEnChar: function (str) {
                return /[A-Za-z]/.test(str);
            }
        };
    })();

    //设置国籍
    Passenger.comment.setNation = function (idtype, that) {
        var natl = that.cls.natl;
        var val = natl.length && natl.data('val');
        var flag;
        var ptype = that.ptype;
        if (!ptype) {
            return;
        }
        if (ptype == 1 && natl.length) {
            if (idtype == 2) {
                natl.data('sp', 1);
                //                if (val && (val === 'HK' || val === 'TW' || val === 'MO')) {
                //                    natl.html('国籍').data('val', '');
                //                } else {
                //                    flag = 1;
                //                }
                flag = 1;
            } else if (idtype == 7) {
                natl.html('中国香港').data('val', 'HK');
            } else if (idtype == 8) {
                natl.html('中国台湾').data('val', 'TW');
            } else {
                flag = 1;
            }
            if (flag) {
                natl.html(that.passengerInfo.NationalityName || '国籍');
                natl.data('val', that.passengerInfo.NationalityCode);
            }
        }
    };
    //选择证件类型回调
    Passenger.comment.chooseIdType = function (type, that) {
        var cls = that.cls;
        if (type == 1) {
            cls.option.hide().data('hide', 1);
        } else {
            cls.option.show().data('hide', 0);
        }
        if (type == 100) {
            cls.later.hide().data('hide', 1);
        } else {
            $.each(cls.later, function (k, v) {
                !$(this).hasClass('option') && $(this).show().data('hide', 0);
            })
        }
    };

    //生成随机旅客号
    Passenger.comment.getRandom = function () {
        return 'tempid' + (new Date).getTime();
    };

    //时间格式
    Passenger.comment.dateformat = function (str) {
        var ret, tempdate;
        if (str && str.indexOf('/') > -1) {
            var mystr = str.replace(new RegExp("\/", "g"), '');
            var re = /Date\((\S+)\)/ig;
            tempdate = new Date(eval(re.exec(mystr)[1]));
            ret = tempdate.getFullYear() + "-" + (tempdate.getMonth() + 1) + "-" + tempdate.getDate();
        } else {
            ret = str;
        }
        return ret;
    };



    //************************************************************************************************//
    //选择证件，性别等
    Passenger.select = Passenger.select || {};

    Passenger.select = (function () {
        var instance;
        function myselect(obj) {
            this.self = obj;
            //this.BaseInfo = Passenger.comment.resetInfo();
            this.saveWrong = false;
            var $input = obj.$el.find('input');
            obj.$el.on("click", 'label', function () {
                //                var $next = $(this).next();
                //                if ($next.hasClass('v_error_tips')) {
                //                    $next.remove();
                //                }
                var $p = $(this).find('p');
                if ($p && $p.hasClass('v_error_tips')) {
                    $p.remove();
                }
            });
        };
        myselect.prototype.selectIdType = function () {
            var my = this;
            var that = this.self;
            var input = that.cls.idtype;
            var scroll = new radioList({
                title: '选择证件',
                data: that.idCardsArr,
                index: parseInt(input.attr('index'), 10),
                itemClick: function (item) {
                    input.html(item.val);
                    input.attr('type', item.key);
                    input.attr('index', item.index);
                    Passenger.comment.chooseIdType(item.key, that);
                    if (that.cls.idtype_select.length && that.cls.nation_select.length) {
                        //that.setNation.call(self, ptype, item.key);
                        Passenger.comment.setNation(item.key, that);
                    }
                    //切换证件的时候，如果用户有信息则显示出来
                    if (that.psgIcdInf && that.psgIcdInf[item.key]) {
                        that.cls.idno.val(that.psgIcdInf[item.key].IDCardNo);
                        if (that.psgIcdInf[item.key].IDCardTimelimit) {
                            var mydate = Passenger.comment.dateformat(that.psgIcdInf[item.key].IDCardTimelimit);
                            var mydates = mydate.split('-');
                            that.cls.iCdInf.html(mydates[0] + '年' + mydates[1] + '月' + mydates[2] + '日' + '  有效期');
                            that.cls.iCdInf.data("vdt", mydates[0] + '-' + mydates[1] + '-' + mydates[2]);
                            //input.attr('index', [mydates[0].index, mydates[1].index, mydates[2].index].join('-'));
                            var myYear = that.nowDate.getFullYear();
                            var vdtArrs = Passenger.comment.getRangeDate(myYear, myYear + 50, !0);
                            var yindex = _.indexOf(vdtArrs[0], +mydates[0]);
                            var vdt_index = [yindex == -1 ? 50 : yindex, _.indexOf(vdtArrs[1], +mydates[1]), _.indexOf(vdtArrs[2], +mydates[2])].join('-');
                            that.cls.iCdInf.attr('index', vdt_index);
                            that.cls.iCdInf.removeClass('grey');
                        }

                    } else {
                        that.cls.idno.val('');
                        that.cls.iCdInf.html('证件有效期');
                        that.cls.iCdInf.attr('index', "0-0-0");
                        that.cls.iCdInf.addClass('grey');
                    }
                    //
                    my.clearwrong();
                }
            });
            scroll.show();
        };
        myselect.prototype.selectGender = function () {
            var that = this.self;
            var input = that.cls.gender;
            var index = input.attr('index');
            if (index) {
                index = index == "M" ? 0 : 1;
            }
            var scroll = new radioList({
                title: '选择性别',
                data: [{
                    key: 'M',
                    val: '男'
                }, {
                    key: 'F',
                    val: '女'
                }],
                index: index == -1 ? null : index,
                itemClick: function (item) {
                    input.html(item.val);
                    input.attr('index', item.key);
                    input.removeClass('grey');
                    input.next().remove();
                }
            });
            scroll.show();
        };
        myselect.prototype.selectBirth = function () {
            var that = this.self;
            var input = that.cls.birth;
            var radi = new radio({
                title: '选择日期',
                data: Passenger.comment.getRangeDate(1930, that.nowDate.getFullYear()),
                index: input.attr('index').split('-') || [0, 0, 0],
                okClick: function (item) {
                    input.html(item[0].key + '年' + item[1].key + '月' + item[2].key + '日' + '  出生');
                    input.data("btd", item[0].key + '-' + item[1].key + '-' + item[2].key);
                    input.attr('index', [item[0].index, item[1].index, item[2].index].join('-'));
                    input.removeClass('grey');
                    if (input.next()) {
                        input.next().remove();
                    }
                }
            });
            radi.show();
        };
        myselect.prototype.selectPeriod = function () {
            var that = this.self;
            var year = that.nowDate.getFullYear();
            var input = that.cls.iCdInf;
            var radi = new radio({
                title: '选择有效期',
                data: Passenger.comment.getRangeDate(year, year + 50),
                index: input.attr('index').split('-') || [0, 0, 0],
                okClick: function (item) {
                    input.html(item[0].key + '年' + item[1].key + '月' + item[2].key + '日' + '  有效期');
                    input.data("vdt", item[0].key + '-' + item[1].key + '-' + item[2].key);
                    input.attr('index', [item[0].index, item[1].index, item[2].index].join('-'));
                    input.removeClass('grey');
                    if (input.next()) {
                        input.next().remove();
                    }
                }
            });
            radi.show();
        };
        myselect.prototype.selectNation = function () {
            var that = this.self;
            var val = that.cls.natl.data('val');
            var sp = that.cls.natl.data('sp');
            var url = sp ? 'order.national?sp=1' : 'order.national';
            this.save(false);
            if (that.pagename == "order") {
                that.saveData();
            }
            if (val) {
                orderParam.setAttr('currentNational', {
                    val: val,
                    name: that.cls.natl.html()
                });
            }
            that.forward(url);
        };

        //选择证件以后，错误信息要消除
        myselect.prototype.clearwrong = function () {
            var that = this.self;
            //首先要消除input下面的提示
            that.$el.find('p').filter('.v_error_tips').remove();
            //
            //var input1 = that.cls.gender;
        };

        //验证
        myselect.prototype.checkName = function (str, type, val) {
            var that = this.self;
            var cReg = Passenger.comment.cReg;
            var _ret;
            var mycardid = that.cls.idtype.attr('type') && parseInt(that.cls.idtype.attr('type'), 10);
            if ('' === str) {
                _ret = '请填写姓名';
            } else if (mycardid && mycardid == 1) {
                if (!cReg.isCnChar(str)) {
                    _ret = '姓名只能为中文';
                }
            } else if (cReg.hasCnChar(str)) {
                if (type == 'national' && val == '中国大陆')
                    _ret = '非中国国籍请填写英文姓名';
                return this.checkCnName(str, true);
            } else if (type == 'ID' && val == 1)
                _ret = '请保持姓名与证件上的姓名一致';
            else
                return this.checkEnName(str, true);
            if (_ret) {
                this.showWrongMsg(_ret, that.cls.name);
                return false
            }
            return true;
        };
        myselect.prototype.checkCnName = function (str, strbool) {
            var that = this.self;
            var cReg = Passenger.comment.cReg;
            var _ret;
            if ('' === str)
                _ret = "请填写中文名";
            else if (cReg.isCnChar(str) && str.length === 1)
                _ret = "中文姓名不可少于2个汉字";
            else if (cReg.isEnChar(str) || cReg.isEnName(str))
                _ret = "请保持姓名与证件上的姓名一致";
            else if (!/^[\u4e00-\u9fa5a-zA-Z-]+$/.test(str))
                _ret = "中文姓名只能包含汉字（至少一个）、字母和连字符，生僻字可用拼音代替";
            else {
                if (cReg.hasEnChar(str))
                    that.Tips.push('请确认填写的姓名与证件上姓名是否一致，生僻字可用拼音代替');
                if (/\u5c0f\u59d0|\u5148\u751f|\u592a\u592a|\u592b\u4eba/.test(str))
                    that.Tips.push('您提交的姓名中含有称谓，请确认是否为您证件上的姓名');
            }
            if (_ret) {
                if (strbool) {
                    this.showWrongMsg(_ret, that.cls.name);
                } else {
                    this.showWrongMsg(_ret, that.cls.cname);
                }
                return false;
            }
            return true;
        };
        myselect.prototype.checkEnName = function (str, strbool) {
            var that = this.self;
            var cReg = Passenger.comment.cReg;
            var _ret;
            if ('' === str)
                _ret = "请填写英文姓名，姓名格式为姓/名，姓与名之间用 / 分隔，如Green/Jim King";
            else if (str.length < 2)
                _ret = '英文姓名不可少于2个英文单词。姓与名之间必须用/隔开';
            else if (!cReg.isEnName(str))
                _ret = "请填写正确的英文姓名，姓名格式为姓 / 名，姓与名之间用 / 分隔，如Green/Jim King";
            else if (/[^a-zA-Z. \/'-]/.test(str))
                _ret = "英文姓名中包含非法字符，请检查";
            var name = str.split('/');
            if (/[^a-zA-Z]/.test(name[0]))
                _ret = "英文的姓中只能包含字母";
            else if (!/^[a-zA-Z]/.test(name[1]))
                _ret = "英文的名必须以字母开头";
            if (_ret) {
                if (strbool) {
                    this.showWrongMsg(_ret, that.cls.name);
                } else {
                    this.showWrongMsg(_ret, that.cls.ename);
                }
                return false;
            }
            return true;
        };
        myselect.prototype.checkIdCard = function (str, type) {
            var that = this.self;
            var _name = '1@身份证|2@护照|3@学生证|4@军官证|6@驾驶证|7@回乡证|8@台胞证|10@港澳通行证|11@国际海员证|20@外国人永久居留证|21@旅行证|22@台湾通行证|23@士兵证|24@临时身份证|25@户口簿|26@警官证|99@其它';
            var _ref = {};
            var _ret;
            $.map(_name.split('|'), function (v, k) {
                var _ar = v.split('@');
                _ref[+_ar[0]] = _ar[1];
            })
            if (!type)
                _ret = '请填写证件类型';
            else if ('' === str)
                _ret = '请填写' + _ref[type] + '号码';
            else if (type === 1) {
                if (!ParseID.checkId(str))
                    _ret = '请输入正确的' + _ref[type] + '号码';
            } else {
                if (type === 8) {
                    if (/[^A-Za-z0-9()（）]/.test(str))
                        _ret = '请填写正确的台胞证号码：号码中只能包含数字、字母或括号';
                } else if (type === 4 || type === 13) {
                    if (/[^\u4e00-\u9fa5a-zA-Z0-9]/.test(str)) {
                        _ret = '请填写正确的军人证号码，号码中只能包含汉字、数字和字母';
                    }
                } else {
                    if (/[^A-Za-z0-9]/.test(str))
                        _ret = "请填写正确的" + _ref[type] + "号码，号码中只能包含数字或字母";
                }
            }
            if (_ret) {
                this.showWrongMsg(_ret, that.cls.idno);
                return false
            }
            return true;
        };
        myselect.prototype.checkNull = function (str, name, ipt, flag) {
            var that = this.self;
            var _ret = "";
            if (flag === 0) {
                if (!str) {
                    _ret = '请填写' + name;
                }
            } else {
                str = str.replace('请选择', '');
                if (str === name) {
                    _ret = '请选择' + name;
                }
            }
            if (_ret) {
                this.showWrongMsg(_ret, that.cls[ipt]);
                return false;
            }
            return true;
        };
        myselect.prototype.checkMobile = function (str) {
            var that = this.self;
            var _ref = "";
            if (!/^0?1[3458]\d{9}$/.test(str)) {
                _ref = '请填写正确的手机号码';
            }
            if (_ref) {
                this.showWrongMsg(_ref, that.cls.mphone);
                return false;
            }
            return true;
        };
        myselect.prototype.checkVdt = function (str) {
            var that = this.self;
            var _ret = "";
            var dDate = that.departDate || that.nowDate;
            var strdate = that.util.helper.strdate;
            var day = (strdate(str) - strdate(dDate)) / (3600 * 24 * 1000);
            if (!str) {
                //this.showToast('请填写信息');
                //return false;
                _ret = '请填写有效日期';
            } else if (day <= 0) {
                //this.showToast('您的证件已经过了有效期，会影响您正常登机。建议重新办理后再预订。');
                //return false;
                _ret = '您的证件已经过了有效期，会影响您正常登机。建议重新办理后再预订。';
            } else if (day < 180) {
                that.Tips.push('从旅行日期计算，您的证件有效期已不足六个月，可能无法顺利出入境，建议您核实确认。');
            } else if (day < 360) {
                that.Tips.push('从旅行日期计算，您的证件有效期已不足一年，建议您核实确认。');
            }
            if (_ret) {
                this.showWrongMsg(_ret, that.cls.iCdInf);
                return false
            }
            return true;
        };
        myselect.prototype.checkBirth = function (str) {
            var that = this.self;
            var _ret = "";
            var dDate = that.departDate || that.nowDate;
            var strdate = that.util.helper.strdate;
            if (!str) {
                _ret = '请填写信息';
            } else if (that.cls.iCdInf_select.length && strdate(str) >= strdate(dDate)) {
                _ret = '出生日期不得晚于出发日期';
            }
            if (_ret) {
                this.showWrongMsg(_ret, that.cls.birth);
                return false
            }
            return true;
        };

        //用来专门操作错误提示
        myselect.prototype.showWrongMsg = function (msg, ele) {
            var _msg = $("<p>", {
                class: "v_error_tips",
                text: msg
            });
            _msg.insertAfter(ele);
            _msg.css("visibility", "hidden");
            window.setTimeout(function () { _msg.css("visibility", "visible"); }, 100)
        };

        //判断是否是成人
        myselect.prototype.isAdu = function (str) {
            var that = this.self;
            var myDate = that.psgDate || that.nowDate;
            var thatday = new Date(Date.parse(str.replace(/-/g, '/')));
            var month = myDate.getMonth();
            var day = myDate.getDate();
            var age = myDate.getFullYear() - str.substring(0, 4) - 1;
            if (thatday.getMonth() < month || thatday.getMonth() == month && thatday.getDate() <= day) {
                age++;
            }
            return age >= 12 ? true : false;
        };

        myselect.prototype.save = function (bl, backfun) {
            var that = this.self;
            this.BaseInfo = Passenger.comment.resetInfo();
            //删掉所有的错误提示
            that.$el.find('p').filter('.v_error_tips').remove();

            var cReg = Passenger.comment.cReg;
            var tpl = that.custtpl || that.customTpl;
            var cls = that.cls;
            var trim = $.trim;
            var data = bl ? {} : that.passengerInfo;
            if (!$.isEmptyObject(that.passengerInfo)) {
                this.BaseInfo = that.passengerInfo;
            }
            var err = 0;
            var temp = TempPassengerStore.getAttr('tempPassengers') || {};
            var list = TempPassengerStore.getAttr('passengers') || {};
            that.Tips = [];
            if (tpl.name) {
                data.name = trim(cls.name.val());
                if (bl && !this.checkName(data.name)) {
                    err++;
                } else {
                    if (cReg.hasCnChar(data.name)) {
                        data.CNName = data.name;
                        this.BaseInfo.CNName = data.CNName;

                    } else {
                        var tmpEnm = data.name.split('/');
                        var tmpEnmf = tmpEnm[1] ? tmpEnm[1].split(/\s+/) : '';
                        this.BaseInfo.ENLastName = data.ENLastName = tmpEnm[0];
                        this.BaseInfo.ENFirstName = data.ENFirstName = tmpEnmf ? tmpEnmf[0] : '';
                        this.BaseInfo.ENMiddleName = data.ENMiddleName = tmpEnmf[1] ? tmpEnmf[1] : '';
                    }
                }
            }
            if (tpl.cNm) {
                data.CNName = trim(cls.cname.val());
                this.BaseInfo.CNName = data.CNName;
                var cnatl = cls.natl;
                var cntlval = !cls.nation_select.data('hide') && cnatl.length && cnatl.data('val') && cnatl.data('val').toLowerCase();
                var blval = (cntlval === 'cn' || cntlval === 'hk' || cntlval === 'mo' || cntlval === 'tw');
                if (bl && (!cntlval || blval) && !this.checkCnName(data.CNName)) {
                    err++;
                }
            }
            if (tpl.eNm && !cls.psg_ename.data('hide')) {
                var enm = trim(cls.ename.val());
                var senm;
                var ssenm;
                if (enm) {
                    senm = enm.split('/');
                    ssenm = senm[1] ? senm[1].split(/\s+/) : '';
                    this.BaseInfo.ENLastName = data.ENLastName = senm[0];
                    this.BaseInfo.ENFirstName = data.ENFirstName = ssenm ? ssenm[0] : '';
                    this.BaseInfo.ENMiddleName = data.ENMiddleName = ssenm[1] ? ssenm[1] : '';
                }
                if (bl && !this.checkEnName(enm)) {
                    err++;
                }
            }
            if (tpl.iCdtp) {
                data.MemberUserIDCardInfos = [{
                    IDCardType: cls.idtype.attr('type') && parseInt(cls.idtype.attr('type'), 10),
                    IDCardNo: trim(cls.idno.val()),
                    IdCardSavePath: "",
                    IsCredit: true,
                    IsFlightI: true,
                    IsFlightN: true,
                    IsIDCardPic: false,
                    IsTrain: true,
                    PassportType: ""
                }];
                if (bl && (!this.checkNull(cls.idtype.html(), '证件类型', 'idtype', 1) || (!cls.idNoLi.data('hide') && !this.checkIdCard(data.MemberUserIDCardInfos[0].IDCardNo, +data.MemberUserIDCardInfos[0].IDCardType)))) {
                    err++;
                } else {
                    if (data.MemberUserIDCardInfos[0].IDCardType == 1 && data.MemberUserIDCardInfos[0].IDCardNo) {
                        //根据身份证  获取出生日期、性别、年龄
                        var info = ParseID.parseId(data.MemberUserIDCardInfos[0].IDCardNo);
                        data.Birthday = info.age;
                        data.Gender = info.sex;
                        data.NationalityCode = "CN";
                        data.NationalityName = "中国大陆";
                        this.BaseInfo.Birthday = data.Birthday;
                        this.BaseInfo.Gender = data.Gender;
                        this.BaseInfo.NationalityCode = "CN";
                        this.BaseInfo.NationalityName = "中国大陆";
                    }
                }
            }
            if (tpl.ntl && !cls.nation_select.data('hide')) {
                data.NationalityCode = cls.natl.data('val');
                data.NationalityName = cls.natl.text();
                this.BaseInfo.NationalityCode = data.NationalityCode;
                this.BaseInfo.NationalityName = cls.natl.text();
                if (bl && !this.checkNull(cls.natl.html(), '国籍', 'natl', 1)) {
                    err++;
                }
            }
            if (tpl.gd && !cls.gender_select.data('hide')) {
                data.Gender = cls.gender.attr('index');
                this.BaseInfo.Gender = data.Gender;
                if (bl && !this.checkNull(cls.gender.html(), '性别', 'gender', 1)) {
                    err++;
                }
            }
            if (tpl.btd && !cls.birth_select.data('hide')) {
                data.Birthday = cls.birth.data("btd");
                this.BaseInfo.Birthday = data.Birthday;
                if (bl) {
                    if (!this.checkNull(cls.birth.html(), '出生日期', 'birth', 1)) {
                        err++;
                    } else if (tpl.icdVdt && !this.checkBirth(data.Birthday)) {
                        err++;
                    }
                }
            }
            if (tpl.hmPc && !cls.hmPc.data('hide')) {
                data.BirthPlace = trim(cls.bplace.val());
                this.BaseInfo.BirthPlace = data.BirthPlace;
                if (bl && !this.checkNull(data.BirthPlace, '出生地', 'bplace', 0)) {
                    err++;
                }
            }
            if (tpl.icdVdt && !cls.iCdInf_select.data('hide')) {
                data.MemberUserIDCardInfos[0].IDCardTimelimit = cls.iCdInf.data("vdt");
                if (bl) {
                    if (!this.checkNull(cls.iCdInf.html(), '证件有效期', 'iCdInf', 1)) {
                        err++;
                    } else if (!this.checkVdt(data.MemberUserIDCardInfos[0].IDCardTimelimit)) {
                        err++;
                    }
                }
            }
            if (tpl.mbp) {
                data.MobilePhone = trim(cls.mphone.val());
                this.BaseInfo.MobilePhone = data.MobilePhone;
                if (bl && data.MobilePhone && !this.checkMobile(data.MobilePhone)) {
                    err++;
                }
            }

            //
            if (bl) {
                if (err > 0) {
                    if (backfun) {
                        backfun(false);
                    }
                    this.saveWrong = true;
                } else {
                    this.saveWrong = false; ;
                }
            }

            var passengerId = that.passengerId;

            //替换已有的证件
            var handleData = function (id, infos, ret, type) {
                if (!id) return ret;
                var infoid = type ? 'pId' : 'tempID';
                ret[infoid] = id;
                ret.aegRg = infos[id].PassengerType;
                //var ordercrad = {};
                if (infos[id].MemberUserIDCardInfos && ret.MemberUserIDCardInfos) {
                    $.each(infos[id].MemberUserIDCardInfos, function (k, v) {
                        if (ret.MemberUserIDCardInfos[0].IDCardType != v.IDCardType) {
                            ret.MemberUserIDCardInfos.push(v);

                            //ordercrad.iCdtp = v.IDCardType;
                            //ordercrad.icdNo = v.IDCardNo;
                            //ordercrad.icdVdt = v.IDCardTimelimit;
                            //myorderdata.iCdInf.push(ordercrad);
                        } else {
                            //为了防止证件里面的信息被覆盖
                            ret.MemberUserIDCardInfos[0] = $.extend(v, ret.MemberUserIDCardInfos[0]);
                        }
                    })
                    if (bl) {
                        ret.defaultIdType = ret.MemberUserIDCardInfos[0].IDCardType;
                    } else {
                        //如果是确定，暂时存默认的证件类型
                        ret.tempDefaultIdType = ret.MemberUserIDCardInfos[0].IDCardType;
                    }
                }
                infos[id] = ret;
                return ret;
            };

            var id, infos, flag;
            if (passengerId) {
                id = passengerId;
                infos = list;
                flag = 1;
            } else {
                id = that.tempPassengerId;
                infos = temp;
                flag = 0;
            }
            if (!$.isEmptyObject(infos) && tpl.iCdInf && tpl.iCdInf.length > 0) {
                data = handleData.call(that, id, infos, data, flag);
            }

            if (tpl.iCdInf && tpl.iCdInf.length > 0) {
                this.BaseInfo.MemberUserIDCardInfos = data.MemberUserIDCardInfos;
            }
            this.BaseInfo.defaultIdType = data.defaultIdType;
            this.BaseInfo.tempDefaultIdType = data.tempDefaultIdType;

            if (bl) {
                //设置年龄段
                var tmpage
                if (data.Birthday) {
                    tmpage = this.isAdu(data.Birthday) ? "A" : "C";
                    data.aegRg = tmpage;
                } else {
                    //那我去查看该常旅信息原来有没有填写身份证或者是出生日期
                    if (that.passengerInfo) {
                        if (that.passengerInfo.Birthday) {
                            data.Birthday = Passenger.comment.dateformat(that.passengerInfo.Birthday);
                        }
                    }
                    if (data.Birthday) {
                        tmpage = this.isAdu(data.Birthday) ? "A" : "C";
                        data.aegRg = tmpage;
                    } else {
                        //如果不能判断是成人儿童，则为2，未知年龄
                        //data.aegRg = 1;
                        data.aegRg = "U";
                    }
                }
                this.BaseInfo.PassengerType = data.aegRg;
                var tempStore;
                if (!passengerId && !that.tempPassengerId && !err) {
                    data.tempID = that.tempPassengerId || Passenger.comment.getRandom();
                    //this.BaseInfo.InfoID = data.tempID;
                    this.BaseInfo.tempid = data.tempID;
                    id = data.tempID;
                    //temp[data.tempID] = data;
                    orderParam.removeAttr('psdEdit');
                }
                if (!err) {
                    var callback = function () {
                        //从order来
                        var self = this;

                        //记录id自动选择

                        //保存
                        //infos[id] = self.BaseInfo;
                        var tempInfos = {};
                        tempInfos[id] = self.BaseInfo;

                        //对于order页面还的判断用户填写的旅客信息对不对。唉。。。。
                        if (that.pagename == "order") {
                            var $_this = that.$el.find(".order_btn_save");
                            var $_parent = $_this.parent();
                            var strType = $_parent.find('h3').find('span').filter('.traveller_type').html();
                            var isAdu = strType == "成人" ? 'A' : 'C';
                            //是成人还是儿童啊
                            //只有在证件号是身份证  或者有出生日期模板的情况下判断
                            var currentcard = tempInfos[id].MemberUserIDCardInfos && tempInfos[id].MemberUserIDCardInfos.length > 0 && tempInfos[id].MemberUserIDCardInfos[0];
                            if (tpl.iCdInf && tpl.iCdInf.length > 0) {
                                if ((currentcard.IDCardType == 1 && tpl.icdNo) || (currentcard.IDCardType != 100 && tpl.btd)) {

                                    if (tempInfos[id].PassengerType == 'U' || tempInfos[id].PassengerType == "") {
                                        tempInfos[id].PassengerType = isAdu;
                                    }
                                    if (isAdu != tempInfos[id].PassengerType) {
                                        that.showToast("你正在填写的是" + strType + "旅客信息");
                                        return false;
                                    }
                                } else {
                                    tempInfos[id].PassengerType = isAdu;
                                }
                            } else {
                                tempInfos[id].PassengerType = isAdu;
                            }
                        }

                        if (flag === 1) { //常用旅客
                            infos[id] = tempInfos[id];
                            TempPassengerStore.setAttr('passengers', infos);
                        } else {
                            if (!Passenger.isLogin) {
                                infos[id] = tempInfos[id];
                                TempPassengerStore.setAttr('tempPassengers', infos);
                            }
                        }

                        //
                        if (Passenger.isLogin) {
                            passengerEditStore.setAttr('UID', Passenger.userInfo.UserID);
                            passengerEditStore.setAttr('BizType', 'Vacation');
                            passengerEditStore.setAttr('BookingChannel', 'Online');
                            passengerEditStore.setAttr('BaseInfo', self.BaseInfo);
                            //如果都没证件 那就不用做了
                            if (tpl.iCdInf && tpl.iCdInf.length > 0) {
                                var my_psgs = passengerEditStore.getAttr('BaseInfo');
                                $.each(my_psgs.MemberUserIDCardInfos, function (k, v) {
                                    if (v.IDCardType == 100) {
                                        my_psgs.MemberUserIDCardInfos[k].IDCardType = "";
                                        return false;
                                    }
                                });
                                passengerEditStore.setAttr('BaseInfo', my_psgs);
                            }
                            that.vaShowLoading();
                            passengerEditModel.excute(function (data) {
                                if (flag === 0) {
                                    tempInfos[id].InfoID = data.InfoID;
                                    list[data.InfoID] = tempInfos[id];
                                    TempPassengerStore.setAttr('passengers', list);
                                    var selectedID = orderParam.getAttr('selectedID') || [];
                                    if (_.indexOf(selectedID, data.InfoID) === -1) {
                                        selectedID.push(String(data.InfoID));
                                        orderParam.setAttr('selectedID', selectedID);
                                    }

                                }
                                //self.BaseInfo = {};
                                passengerEditStore.remove();
                                orderParam.removeAttr('edit');
                                that.vaHideLoading();
                                self.changestyle(that, list[data.InfoID]);
                                if (backfun) {
                                    backfun(true);
                                }
                            }, function () {
                                that.showToast('网络连接失败请重试')
                                that.vaHideLoading();
                            }, true, that);
                        } else {
                            var selectedID = orderParam.getAttr('selectedID') || [];
                            var infoId = String(data.pId || data.tempID);
                            if (_.indexOf(selectedID, infoId) === -1) {
                                selectedID.push(infoId);
                                orderParam.setAttr('selectedID', selectedID);
                            }
                            orderParam.removeAttr('edit');
                            self.changestyle(that, infos[id]);
                            if (backfun) {
                                backfun(true);
                            }
                        }
                    };
                    if (that.Tips.length) {
                        this.showTip({
                            title: '确认旅客信息',
                            msg: that.Tips.join('<br/>'),
                            cb: callback
                        })
                    } else {
                        callback.call(this);
                    }
                }
            } else {
                orderParam.setAttr('psdEdit', this.BaseInfo);
            }
        };

        //只是验证内容
        myselect.prototype.justCheck = function () {
            var that = this.self;
            var tpl = that.custtpl || that.customTpl;
            var cls = that.cls;
            var trim = $.trim;
            var data = {};
            var err = 0;
            if (tpl.name) {
                data.name = trim(cls.name.val());
                if (!this.checkName(data.name)) {
                    err++;
                }
            }
            if (tpl.cNm) {
                data.CNName = trim(cls.cname.val());
                var cnatl = cls.natl;
                var cntlval = !cls.nation_select.data('hide') && cnatl.length && cnatl.data('val') && cnatl.data('val').toLowerCase();
                var blval = (cntlval === 'cn' || cntlval === 'hk' || cntlval === 'mo' || cntlval === 'tw');
                if ((!cntlval || blval) && !this.checkCnName(data.CNName)) {
                    err++;
                }
            }
            if (tpl.eNm && !cls.psg_ename.data('hide')) {
                var enm = trim(cls.ename.val());
                if (!this.checkEnName(enm)) {
                    err++;
                }
            }
            if (tpl.iCdtp) {
                data.MemberUserIDCardInfos = [{
                    IDCardType: cls.idtype.attr('type') && parseInt(cls.idtype.attr('type'), 10),
                    IDCardNo: trim(cls.idno.val()),
                    IdCardSavePath: "",
                    IsCredit: true,
                    IsFlightI: true,
                    IsFlightN: true,
                    IsIDCardPic: false,
                    IsTrain: true,
                    PassportType: ""
                }];
                if ((!this.checkNull(cls.idtype.html(), '证件类型', 'idtype', 1) || (!cls.idNoLi.data('hide') && !this.checkIdCard(data.MemberUserIDCardInfos[0].IDCardNo, +data.MemberUserIDCardInfos[0].IDCardType)))) {
                    err++;
                } else {
                    if (data.MemberUserIDCardInfos[0].IDCardType == 1 && data.MemberUserIDCardInfos[0].IDCardNo) {
                        //根据身份证  获取出生日期、性别、年龄
                        var info = ParseID.parseId(data.MemberUserIDCardInfos[0].IDCardNo);
                        data.Birthday = info.age;
                        data.Gender = info.sex;
                        data.NationalityCode = "CN";
                        data.NationalityName = "中国大陆";
                    }
                }
            }
            if (tpl.ntl && !cls.nation_select.data('hide')) {
                data.NationalityCode = cls.natl.data('val');
                data.NationalityName = cls.natl.text();
                if (!this.checkNull(cls.natl.html(), '国籍', 'natl', 1)) {
                    err++;
                }
            }
            if (tpl.gd && !cls.gender_select.data('hide')) {
                data.Gender = cls.gender.attr('index');
                if (!this.checkNull(cls.gender.html(), '性别', 'gender', 1)) {
                    err++;
                }
            }
            if (tpl.btd && !cls.birth_select.data('hide')) {
                data.Birthday = cls.birth.data("btd");
                if (!this.checkNull(cls.birth.html(), '出生日期', 'birth', 1)) {
                    err++;
                } else if (tpl.icdVdt && !this.checkBirth(data.Birthday)) {
                    err++;
                }
            }
            if (tpl.hmPc && !cls.hmPc.data('hide')) {
                data.BirthPlace = trim(cls.bplace.val());
                if (!this.checkNull(data.BirthPlace, '出生地', 'bplace', 0)) {
                    err++;
                }
            }
            if (tpl.icdVdt && !cls.iCdInf_select.data('hide')) {
                data.MemberUserIDCardInfos[0].IDCardTimelimit = cls.iCdInf.data("vdt");
                if (!this.checkNull(cls.iCdInf.html(), '证件有效期', 'iCdInf', 1)) {
                    err++;
                } else if (!this.checkVdt(data.MemberUserIDCardInfos[0].IDCardTimelimit)) {
                    err++;
                }
            }
            if (tpl.mbp) {
                data.MobilePhone = trim(cls.mphone.val());
                if (data.MobilePhone && !this.checkMobile(data.MobilePhone)) {
                    err++;
                }
            }
            if (err > 0) {
                this.saveWrong = true;
            } else {
                this.saveWrong = false;
            }
        };

        //全是坑 哇哈哈 
        myselect.prototype.changestyle = function (obj, infos) {
            if (obj.pagename == "order") {
                var $_this = obj.$el.find(".order_btn_save");
                var $_parent = $_this.parent();
                var strname = "";
                if (infos.InfoID) {
                    $_parent.data("id", infos.InfoID)
                }
                else {
                    $_parent.data("tempid", infos.tempid)
                }
                $_parent.next().remove();
                $_this.removeClass('order_btn_save');
                $_this.find("span").eq(0).html('编辑');

                if (infos.CNName) {
                    strname += infos.CNName + "&nbsp;&nbsp;&nbsp;&nbsp;";
                }
                else if (infos.ENLastName) {
                    strname += infos.ENLastName + "/" + infos.ENFirstName + "&nbsp;&nbsp;" + infos.ENMiddleName;
                }

                $_this.find("span").eq(1).html(strname);

                this.saveorder(obj, infos);

            } else if (obj.pagename == "psgselect") {
                //得到保存按钮所在的元素
                var saves = obj.$el.find(".v_save");
                var $_this;
                $.each(saves, function (i) {
                    if ($(this).css("display") != "none") {
                        $_this = $(this);
                        return false;
                    }
                });
                var $_parent = $_this.parent();
                var strname = "";
                var strcard = "";

                $_parent.siblings().remove();
                $_parent.unwrap().unwrap();
                if (infos.CNName) {
                    strname += infos.CNName + "&nbsp;&nbsp;&nbsp;&nbsp;";
                }
                if (infos.ENLastName) {
                    strname += infos.ENLastName + "/" + infos.ENFirstName + "&nbsp;&nbsp;" + infos.ENMiddleName;
                }
                if (obj.customTpl.iCdInf && obj.customTpl.iCdInf.length > 0) {
                    var mycard = infos.MemberUserIDCardInfos[0];
                    strcard += commonData.IdCardType[mycard.IDCardType] + "&nbsp;&nbsp;" + mycard.IDCardNo;
                }
                $_parent.find("p").eq(0).find("strong").html(strname);
                $_parent.find("p").eq(1).html(strcard);
                $_parent.children().show();
                $_this.hide();
                $_parent.data("idtype", infos.defaultIdType);
                //$_parent.data("age", infos.PassengerType);
                //还不能直接填充infos.PassengerType
                $_parent.data("age", obj.getPeopleType(infos));
                $_parent.data("phone", infos.MobilePhone);
                $_parent.find("i").data("idtype", infos.defaultIdType);


            }
        };

        //order还得存在psgInfo中
        myselect.prototype.saveorder = function (obj, infos) {
            //存入PassengerInfoList
            var arrPsgInfo = orderdata.getAttr('PassengerInfoList') || [];
            var _ref = {};
            $.each(obj.customTpl, function (k, v) {
                if (k === 'iCdInf' || k === 'icdVdt' || k === 'icdNo') {
                    return true;
                }
                if (k == 'iCdtp' && obj.customTpl.iCdtp) {
                    var defaultcard = infos.MemberUserIDCardInfos[0];
                    _ref.IdCardInfo = [{
                        IdCardType: defaultcard.IDCardType,
                        IdCardNo: defaultcard.IDCardNo,
                        IdCardValidDate: Passenger.comment.dateformat(defaultcard.IDCardTimelimit)
                    }];

                } else if (k == 'eNm') {
                    if (infos.ENFirstName && infos.ENLastName) {
                        _ref["EnName"] = {
                            'First': infos.ENFirstName,
                            'Mid': infos.ENMiddleName,
                            'Last': infos.ENLastName
                        }
                    } else {
                        //_ref["EnName"] = null;
                    }
                } else if (k == 'name') {
                    if (infos.CNName) {
                        _ref['CnName'] = infos.CNName;
                    } else if (infos.ENFirstName && infos.ENLastName) {
                        _ref['EnName'] = {
                            'First': infos.ENFirstName,
                            'Mid': infos.ENMiddleName,
                            'Last': infos.ENLastName
                        };
                    }
                } else if (k == 'cNm') {
                    _ref["CnName"] = infos.CNName;
                } else if (k == 'ntl') {
                    _ref["Nationality"] = infos.NationalityCode;
                } else if (k == 'gd') {
                    _ref["Gender"] = infos.Gender == "M" ? 0 : 1;
                } else if (k == 'btd') {
                    _ref["Birthday"] = Passenger.comment.dateformat(infos.Birthday);
                } else if (k == 'hmPc') {
                    _ref["HomePlace"] = infos.BirthPlace;
                } else if (k == 'mbp') {
                    _ref["MobilePhone"] = infos.MobilePhone;
                }
                else {
                    _ref[k] = infos[k];
                }
                _ref.PassengerId = infos.InfoID || infos.tempid || 0;
                //_ref.PassengerId = infos.InfoID || 0;
            });
            if (typeof _ref.aegRg === 'undefined') {
                _ref.AgeRang = infos.PassengerType == "A" ? 1 : (infos.PassengerType == 'C' ? 0 : 2);
            }
            if (arrPsgInfo.length) {
                var nohave = true;
                $.each(arrPsgInfo, function (k, v) {
                    if (v.PassengerId == _ref.PassengerId && _ref.PassengerId != 0) {
                        arrPsgInfo[k] = _ref;
                        nohave = false;
                    }
                    if (v.PassengerId == 0) {
                        arrPsgInfo.splice(k, 1);
                    }
                });
                if (nohave) {
                    arrPsgInfo.push(_ref);
                }
            }
            else {
                arrPsgInfo.push(_ref);
            }
            orderdata.setAttr('PassengerInfoList', arrPsgInfo);
        };

        //弹出的tip
        myselect.prototype.showTip = function (arg) {
            var that = this.self;
            var self = this;
            var alert = new uiAlert({
                title: arg.title || '提示信息',
                message: arg.msg || '',
                buttons: [{
                    text: '取消',
                    click: function () {
                        this.hide();
                    }
                }, {
                    text: '继续提交',
                    click: function () {
                        arg.cb.call(self);
                        this.hide();
                    }
                }]
            });
            alert.show();
        };

        return {
            getInstance: function (obj) {
                if (!instance) {
                    instance = new myselect(obj);
                }
                return instance;
            },
            resExample: function () {
                instance = null;
            }
        }

    })();







    //**************************************************************************************************//

    return Passenger;
});
