/**
 * @File c.user.store.js
 * @author zsb张淑滨 <oxz@ctrip.com|shbzhang@ctrip.com>
 * @description  用户数据Store
 */

define(['cCoreInherit', 'cLocalStore', 'cLocalStorage', 'cUtilCommon'], function (cCoreInherit, cLocalStore, cLocalStorage,cUtilCommon) {

  var ls = cLocalStorage.localStorage;
  /**
   * 用户数据Store,同时操作USER和USERINFO, 其中USERINFO是兼容老的数据格式,可以去掉.
   * 大部分的操作，已封装至cMemberService,
   * @namespace Store.cCommonStore.cUserStore
   * @example 使用方式
   *  var userStore = UserStore.getInstance();
   * @example 数据格式为
   * {
   *  "Address": "",
   *  "Auth": "E82047658BD3D8321E1EEB0F7F5D63EB1A5566AA70098AFE847505E34BD8BD5B",
   *  "Birthday": "19920624",
   *  "BMobile": "13814555555",
   *  "Email": "",
   *  "Experience": 106663,
   *  "ExpiredTime": "/Date(-62135596800000-0000)/",
   *  "Gender": 1,
   *  "IsNonUser": false,
   *  "LoginName": "",
   *  "Mobile": "13814555555",
   *  "PostCode": "",
   *  "UserID": "21634352BAC43044380A7807B0699491",
   *  "UserName": "ggggg",
   *  "VipGrade": 30,
   *  "VipGradeRemark": "钻石贵宾"
   * }
   */
  var UserStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /**
       * Store Key值为USER
       * @readonly
       * @var {string} [Store.cCommonStore.cUserStore.key=USER]
       */
      this.key = 'USER';

      /**
       * Store数据过期时间，默认为30D
       * @var {string} [Store.cCommonStore.cUserStore.lifeTime=30D]
       */
      this.lifeTime = '30D';
    },
    /*
     * @method cCommonStore.UserStore.initialize
     * @param $super
     * @param options
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function ($super, options) {
      $super(options);
    },

    /**
     * 返回用户信息
     * @method Store.cCommonStore.cUserStore.getUser
     * @returns {Object} userinfo 用户信息
     * @example 格式为
     * value": {
		 *    "Address": "",
		 *    "Auth": "CF7D8226D139CF771E2C860CA32EDEA01DDD8DDF07B72BB372B5C8726F718475",
		 *    "Birthday": "20071211",
		 *    "BMobile": "13814555555",
		 *    "Email": "",
		 *    "Experience": 106663,
		 *    "ExpiredTime": "/Date(-62135596800000-0000)/",
		 *    "Gender": 1,
		 *    "IsNonUser": false,
		 *    "LoginName": "",
		 *    "Mobile": "13814555555",
		 *    "PostCode": "",
		 *    "UserID": "21634352BAC43044380A7807B0699491",
		 *    "UserName": "呵呵呵呵呵呵",
		 *    "VipGrade": 30,
		 *    "VipGradeRemark": "钻石贵宾"
		 * }
     * @deprecated cServiceMember.getUser
     */
    getUser: function () {
      var userinfo = ls.oldGet('USERINFO');
      userinfo = userinfo && userinfo.data || null
      if (userinfo) {
        this.set(userinfo)
      }
      return userinfo || this.get();
    },

    /**
     * 保存用户信息
     * @method Store.cCommonStore.cUserStore.setUser
     * @param {Object}  data UserInfo用户信息
     */
    setUser: function (data) {
      this.set(data);
      var timeout = ls.getExpireTime('USER');
      var userinfo = { data: data, timeout: timeout };
      ls.oldSet('USERINFO', JSON.stringify(userinfo));
    },

    /**
     * 移除用户信息，只清空本地登录状态
     * @method Store.cCommonStore.cUserStore.removeUser
     * @description 建议使用cMemberService.logout
     */
    removeUser: function () {
      ls.oldRemove('USERINFO');
      this.remove();
    },

    /**
     * 返回当前用户是否是未注册用户
     * @method Store.cCommonStore.cUserStore.isNonUser
     * @returns {boolean} isNonUser 返回当前用户是否是未注册用户
     * @deprecated
     */
    isNonUser: function () {
      var user = this.getUser();
      return user && !!user.IsNonUser;
    },

    /**
     * 判断当前用户是否登陆
     * @method UserStore.isLogin
     * @returns {Object|boolean} isLogin 当前用户是否登陆
     * @deprecated 建议使用memberService.isLogin代替
     */
    isLogin: function () {
      var user = this.getUser();
      return user && !!user.Auth && !user.IsNonUser;
    },

    /**
     * 返回当前登陆用户的用户名
     * @method Store.cCommonStore.cUserStore.getUserName
     * @returns {String} UserName 用户名
     * @deprecated 建议使用cMemberService.getUserName代替
     */
    getUserName: function () {
      var user = this.getUser();
      return user && user.UserName; //add by byl 此处支持localstorage中的user信息被删除
    },

    /**
     * 返回当前登陆用户的ID
     * @method Store.cCommonStore.cUserStore.getUserId
     * @returns {*|string} userId 用户Id
     */
    getUserId: function () {
      var user = this.getUser() || {};
      return user.UserID || cUtilCommon.getGuid();
    },

    /**
     * @method Store.cCommonStore.cUserStore.getAuth
     * @returns {*|string}
     * @description 返回当前登陆用户的Auth值
     */
    getAuth: function () {
      var userinfo = this.getUser();
      return userinfo && userinfo.Auth;
    },

    /**
     * @method Store.cCommonStore.cUserStore.setAuth
     * @param {String} auth 用户auth字段
     * @description 返回当前登陆用户的Auth值
     * @
     */
    setAuth: function (auth) {
      var isLogin = this.isLogin(),
        userinfo = this.getUser() || {};
      userinfo.Auth = auth;
      userinfo.IsNonUser = isLogin ? false : true;
      this.setUser(userinfo);
    },
    /**
     * @method Store.cCommonStore.cUserStore.setThirdParts
     * @param {Object} membersInfo 所有第三方用户信息
     * @description 存储当前用户所有的第三方登录信息
     */
    setThirdParts:function(membersInfo){
      var isLogin = this.isLogin(),
        userinfo = this.getUser() || {};
      //此过程中如果退出登录的话，不写入第三方用户信息
      if(!isLogin || !membersInfo){
        return;
      }
      userinfo.thirdParts = membersInfo;
      this.setUser(userinfo);
    },
    /**
     * @method Store.cCommonStore.cUserStore.setThirdPartsNull
     * @description 删除当前缓存中的第三方信息
     */
    setThirdPartsNon:function(){
      var isLogin = this.isLogin(),
        userinfo = this.getUser() || {};
      //此过程中如果退出登录的话，不写入第三方用户信息
      if(!isLogin){
        return;
      }
      userinfo.thirdParts = "";
      this.setUser(userinfo);
    },
    /**
     * @method Store.cCommonStore.cUserStore.getThirdParts
     * @description 获取当前用户的所有的第三方登录信息
     */
    getThirdParts:function(){
      var userinfo = this.getUser();
      return userinfo && userinfo.thirdParts;
    },
    /**
     * @method Store.cCommonStore.cUserStore.getThirdPart
     * @param {String} thirdPartType 必填，所有第三方用户信息
     * @description 获取当前用户的某个第三方登录信息
     */
    getThirdPart:function(thirdPartType){
      var userinfo = this.getUser();
      if(thirdPartType && userinfo && userinfo.thirdParts && userinfo.thirdParts.length > 0){
        var thirdParts = userinfo.thirdParts;
        return _.find(thirdParts,function(item){
          if(item.ThirdPartType == thirdPartType){
            return item;
          }
        });
      }
    },
    /**
     * @method Store.cCommonStore.cUserStore.setNonUser
     * @param {String} auth 用户auth
     * @description 设置当前用户为非注册用户
     */
    setNonUser: function (auth) {
      var HeadStore = Common.HeadStore.getInstance();
      HeadStore.setAttr('auth', auth);
      var data = {};
      data.Auth = auth;
      data.IsNonUser = true;
      this.setUser(data);
    },

    /**
     * @method Store.cCommonStore.cUserStore.setExpireTime
     * @param $super
     * @param timeout
     * @description 设置过期时间，同时会操作USERINFO
     */
    setExpireTime: function ($super, timeout) {
      $super(timeout);
      var data = this.get();
      var userinfo = { data: data, timeout: timeout };
      ls.oldSet('USERINFO', JSON.stringify(userinfo));
    }


  });

  return UserStore;
});