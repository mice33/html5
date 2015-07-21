#Lizard2.1 升级列表


1.  全新的UI组件
    >实现UI模板可以根据BU需要灵活配置
2. web与hybrid功能分离,根据环境分别打包,进一步屏蔽web/hybrid的区别,同时减少文件体积
    >h5和hybrid会载入不同的实现
3. util工具类的整理
    >原cUtility类拆分至更细粒度,建议使用cUtilCommon模块代替
    
    >一些方法实现更有效率,与原来的cUtility.isInApp()方法变为cUtilCommon.isInApp属性
4. 与native交互方法重构,与bridge.js解耦
    >新增cHybridShell模块, 调用native方法更加方便,透明
5. 进一步屏蔽web/hybird环境的区别
    >Lizard.goTo 可以实现多webview跳转
    
    >Lizard.goBack 可以自己识别是否需要返回native
    
    >Lizard.jump 可以实现web/hybrid的跨频道跳转
    
    >header 组件实现与native同一套接口
6. 更新doc文档


#Lizard2.1 模块列表


    {
      
      "cBusinessCommon": Lizard.dir + "app/c.app.interface",
      
      "cCoreInherit": Lizard.dir + "common/c.class.inherit",
      "cMessageCenter": Lizard.dir + "common/c.message.center",
      "cAjax": Lizard.dir + "common/c.ajax",
      "cImgLazyload": Lizard.dir + "common/c.img.lazyload",

      "cUtilCacheView": Lizard.dir + "util/c.util.cacheview",
      "cUtilCommon": Lizard.dir + "util/c.util.common",
      "cUtilDate": Lizard.dir + "util/c.util.date",
      "cUtilHybrid": Lizard.dir + "util/c.util.hybrid",
      "cUtilObject": Lizard.dir + "util/c.util.object",
      "cUtilPath": Lizard.dir + "util/c.util.path",
      "cUtilPerformance": Lizard.dir + "util/c.util.performance",
      "cUtilValidate": Lizard.dir + "util/c.util.validate",
      "cUtilCryptBase64": Lizard.dir + "util/crypt/c.crypt.base64",
      "cUtilCryptRSA": Lizard.dir + "util/crypt/c.crypt.rsa",

      "cPageParser": Lizard.dir + "app/c.page.parser",
      "cPageModelProcessor": Lizard.dir + "app/c.page.model.processor",

      "cPageView": Lizard.dir + "page/c.page.view",
      "cPageList": Lizard.dir + "page/c.page.list",

      "cAbstractModel": Lizard.dir + "data/model/c.abstract.model",
      "cModel": Lizard.dir + "data/model/c.model",
      "cUserModel": Lizard.dir + "data/model/c.user.model",

      "cAbstractStore": Lizard.dir + "data/store/c.abstract.store",
      "cLocalStore": Lizard.dir + "data/store/c.local.store",
      "cSessionStore": Lizard.dir + "data/store/c.session.store",
      "cMemoryStore": Lizard.dir + "data/store/c.memory.store",
      "cCommonStore": Lizard.dir + "data/store/c.common.store",
      "cHeadStore": Lizard.dir + "data/store/common/c.head.store",
      "cUserStore": Lizard.dir + "data/store/common/c.user.store",
      "cMarketStore": Lizard.dir + "data/store/common/c.market.store",

      "cAbstractStorage": Lizard.dir + "data/storage/c.abstract.storage",
      "cLocalStorage": Lizard.dir + "data/storage/c.local.storage",
      "cSessionStorage": Lizard.dir + "data/storage/c.session.storage",
      "cMemoryStorage": Lizard.dir + "data/storage/c.memory.storage",

      "cUIInputClear": Lizard.dir + "ui/c.ui.input.clear",
      "cUIBase": Lizard.dir + "ui/c.ui.base",

      //新UI组件
      'UIView': Lizard.dir + 'ui/ui.abstract.view',
      'UILayer': Lizard.dir + 'ui/ui.layer',
      'UIAlert': Lizard.dir + 'ui/ui.alert',
      'UIMask': Lizard.dir + 'ui/ui.mask',
      'UILoadingLayer': Lizard.dir + 'ui/ui.loading.layer',
      'UIToast': Lizard.dir + 'ui/ui.toast',
      'UIInlineView': Lizard.dir + 'ui/ui.inline.view',
      'UINum': Lizard.dir + 'ui/ui.num',
      'UISwitch': Lizard.dir + 'ui/ui.switch',
      'UIBubbleLayer': Lizard.dir + 'ui/ui.bubble.layer',
      'UITab': Lizard.dir + 'ui/ui.tab',
      'UIScroll': Lizard.dir + 'ui/ui.scroll',
      'UIScrollLayer': Lizard.dir + 'ui/ui.scroll.layer',
      'UIRadioList': Lizard.dir + 'ui/ui.radio.list',
      'UISelect': Lizard.dir + 'ui/ui.select',
      'UIGroupSelect': Lizard.dir + 'ui/ui.group.select',
      'UIGroupList': Lizard.dir + 'ui/ui.group.list',
      'UICalendar': Lizard.dir + 'ui/ui.calendar',
      'UISlider': Lizard.dir + 'ui/ui.slider',
      'UIImageSlider': Lizard.dir + 'ui/ui.image.slider',
      'UIWarning404': Lizard.dir + 'ui/ui.warning404',
      'UIHeader': Lizard.dir + 'ui/ui.header',
      'UIIdentitycard': Lizard.dir + 'ui/ui.identitycard',
      'UILayerList': Lizard.dir + 'ui/ui.layer.list',
      'UIAnimation': Lizard.dir + 'ui/c.ui.animation',

      'UITemplates': Lizard.dir + 'ui/ui.templates',

      "cGeoService": Lizard.dir + "service/c.service.geo",
      "cMemberService": Lizard.dir + "service/c.service.member",
      "cGuiderService": Lizard.dir + "service/c.service.guider",

      "cHybridMember": Lizard.dir + "service/hybrid/c.hybrid.memberService",
      "cHybridGuider": Lizard.dir + "service/hybrid/c.hybrid.guider",
      "cHybridGeolocation": Lizard.dir + "service/hybrid/c.hybrid.geolocation",
      "cGeoHelper": Lizard.dir + "service/web/c.geo.helper",
      "cWebMember": Lizard.dir + "service/web/c.web.memberService",
      "cWebGuider": Lizard.dir + "service/web/c.web.guider",
      "cWebGeolocation": Lizard.dir + "service/web/c.web.geolocation",

      "cStatic": Lizard.dir + "app/web/c.web.static",
      "cBaseInit": Lizard.dir + "app/c.base.init",
      "cAbstractApp": Lizard.dir + "app/c.abstract.app",
      "cWebApp": Lizard.dir + "app/web/c.web.app",
      "cHybridApp": Lizard.dir + "app/hybrid/c.hybrid.app",
      "cWebViewApp": Lizard.dir + "app/hybrid/c.webview.app",
      "cHybridFacade": Lizard.dir + "app/hybrid/c.hybrid.facade",
      "cHybridShell": Lizard.dir + "app/hybrid/c.hybrid.shell",
      "cHybridHeader": Lizard.dir + "app/hybrid/c.hybrid.header",
      "cHybridAppInit": Lizard.dir + "app/hybrid/c.hybrid.init",
      "cWebAppInit": Lizard.dir + "app/web/c.web.init"
    },
    "map": {
      "*": {
        "cUtility": "cUtilCommon",
        "cStore": "cLocalStore",
        "cGuider": "cGuiderService",
        "CommonStore":"cCommonStore"
      }
    }

#Lizard2.1 文件列表