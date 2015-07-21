/**
 * @File c.local.store.js
 * @author zsb张淑滨 <shbzhang@Ctrip.com>
 * @description 以localstorage为数据存储的Store
 */
/**
 * 以localstorage为数据存储的Store
 * @namespace Store.cLocalStore
 * @augments Store.cAbstractStore
 * @example
 *  define(['cCoreInherit','cLocalStore'], function (cCoreInherit,cLocalStore ) {
 *    var StoreCase = new cCoreInherit.Class(cLocalStore, {
 *      __propertys__: function () {
 *        this.lifeTime = '2D',          //超时时间两天
 *        this.defaultData = {
 *          name : ""
 *        }
 *      },
 *      initialize:    function ($super, options) {
 *        $super(options);
 *      },
 *      key: 'STORAGE_EXAMPLE', //设置key值
 *    });
 *
 *    return  StoreCase;
 *  });
 *
 * var demoStore = StoreCase.getInstance();
 * var data = {'name':'擎天柱'}
 * demoStore.set(data);
 */
define(['cCoreInherit','cAbstractStore','cLocalStorage','cMemoryStorage','cUtilCommon'], function (cCoreInherit,cAbstractStore,cLocalStorage,cMemoryStorage,cUtilCommon) {



  var LocalStore = new cCoreInherit.Class(cAbstractStore,{
    __propertys__: function () {
	    /*
	     * 本地存储对象
	     * @var {Object} cStore.sProxy
	     */
      this.sProxy = cUtilCommon.isPrivateModel? cMemoryStorage.getInstance() : cLocalStorage.getInstance();
    },
	  /**
	   * @method cStore.initialize
	   * @param $super
	   * @param options
	   * @description 复写自顶层Class的initialize，赋值队列
	   */
    initialize: function ($super, options) {
      $super(options);
    }
  });

  return LocalStore;
});