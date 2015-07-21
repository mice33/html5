define(['UIView', getAppUITemplatePath('ui.warning404'), 'cGuiderService', getAppUICssPath('ui.warning404')], function (UIView, template, Guider, style) {

  return _.inherit(UIView, {
    propertys: function ($super) {
      $super();
      this.resetDefaultProperty();

    },

    resetDefaultProperty: function () {

      //html模板
      this.template = template;

      this.addUIStyle(style);

      this.datamodel = {
        tel: '4000086666',
        loadFail: '加载失败，请稍后再试试吧',
        telText: '或者拨打携程客服电话',
        tryAgain: '重试',
        contact: '联系客服',
        showContact: true
      };

      this.events = {
        'click .js_contact': 'callTelAction',
        'click .js_retry_btn': 'retryAction'
      };

      this.retryAction = function (e) {
        console.log('override retryAction');
      };

      this.callTelAction = function (e) {
        //      window.location.href = 'tel:' + self.tel;
        var self = this;

        Guider.apply({
          hybridCallback: function () {
            Guider.callService();
          },
          callback: function () {
            window.location.href = 'tel:' + self.datamodel.tel;
          }
        });

      };

    },

    setDatamodel: function (datamodel, retryAction, telAction) {
      if (!datamodel) datamodel = {};
      _.extend(this.datamodel, datamodel);
      this.retryAction = retryAction;
      this.callTelAction = telAction;
      this.refresh();
    },

    initialize: function ($super, opts) {
      $super(opts);
    }

  });

});
