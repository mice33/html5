
/*
用于继承的类，会自动垂直居中

*/
define(['UILayer', getAppUITemplatePath('ui.loading.layer'), getAppUICssPath('ui.loading.layer')], function (UILayer, template, style) {


  return _.inherit(UILayer, {
    propertys: function ($super) {
      $super();

    },

    resetDefaultProperty: function ($super) {
      $super();
      //html模板
      this.template = template;

      //只继承基类的重置css
      this.uiStyle[1] = style;

      this.datamodel = {
        closeBtn: false,
        content: ''
      };

      this.addEvents({
        'click .js_close': 'closeAction'
      });

      this.maskToHide = false;
      this.hasPushState = false;

      this.closeAction = function (e) {
        this.hide();
      };

    },

    initElement: function () {
      this.el = this.$('.cui-grayload-text');
    },

    initialize: function ($super, opts) {
      $super(opts);
    },

    addEvent: function ($super) {
      $super();

    },

    reposition: function () {
      var w = '60px';
      if (this.datamodel.closeBtn || this.datamodel.content.length > 0) {
        w = '100px';
      }

      this.$root.css({
        'width': w
      });

      this.$root.css({
        'position': 'fixed',
        'left': '50%',
        'top': '50%',
        'margin-left': -(this.$el.width() / 2) + 'px',
        'margin-top': -(this.$el.height() / 2) + 'px'
      });

    },

    setDatamodel: function (content, fn) {
      var isChange = false;
      if (content) {
        this.datamodel.content = content;
        isChange = true;
      } else {
        this.datamodel.content = '';
      }
      if (fn) {
        this.closeAction = fn; isChange = true;
        this.datamodel.closeBtn = true;
      } else {
        this.datamodel.closeBtn = false;
      }
      if (isChange) this.refresh();
    }

  });


});
