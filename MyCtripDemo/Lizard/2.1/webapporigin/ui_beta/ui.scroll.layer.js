define(['UILayer', getAppUITemplatePath('ui.scroll.layer'), 'UIScroll'], function (UILayer, template, UIScroll) {


  return _.inherit(UILayer, {
    propertys: function ($super) {
      $super();
      //html模板
      this.template = template;
      //      this.addUIStyle(style);

      //用户未传入css，需要外部css样式支持
      this.needOuterStyle = false;

      this.datamodel = {
        title: '',
        btns: [
          { name: 'cancel', className: 'js_cancel' },
          { name: 'ok', className: 'js_ok' }
        ]
      };

      //事件机制
      this.addEvents({
        'click .js_ok': 'okAction',
        'click .js_cancel': 'cancelAction',
        'click .js_close': 'closeAction'
      });

      //body内部需要装载的dom结构，可能是包装过的dom结构
      this.html = null;

      this.width = 280;
      this.maxHeight = 300;

      //传入dom字符串所占的高度
      this.sheight = 0;
      this.scrollOpts = {};

    },

    okAction: function () {
      console.log('ok');
    },

    cancelAction: function () {
      console.log('cancel');
    },

    closeAction: function () {
      this.hide();
    },

    initElement: function () {
      this.swrapper = this.$('.js_body');
      this.footer = this.$('.js_footer');
    },

    //处理shadowdom要做容器的场景
    handleShadowContainer: function () {
      if (!this.openShadowDom || !this.needOuterStyle) return;

      var nodes = this.swrapper.children();
      nodes.addClass(this.id + '_js_shadow_container');

      //将装载的html取出来，放到根节点
      this.swrapper.html('<content selector=".' + this.id + '_js_shadow_container"></content>');
      this.$root.append(nodes);

      //如果btns不是字符串便不处理下面逻辑
      if (!_.isString(this.datamodel.btns)) return;
      //如果footer也自定义的话
      nodes = this.footer.children();
      nodes.addClass(this.id + '_js_footer_shadow_container');
      this.footer.html('<content selector=".' + this.id + '_js_footer_shadow_container"></content>');
      this.$root.append(nodes);

    },

    initSize: function () {
      if (!this.html) return;

      this.html = $(this.html);

      if (this.html.length > 1) this.html = $('<div></div>').append(this.html);

      this.html.css({
        'position': 'absolute'
      });

      this.swrapper.append(this.html);
      this._initWrapperSize();
    },

    _initWrapperSize: function () {
      var h = 0;
      if (this.width)
        this.$root.width(this.width);

      this.sheight = this.html.height()
      h = Math.min(this.sheight, this.maxHeight);
      this.swrapper.height(h);

      this.footer.height(this.footer.height());
    },

    //内部高度变化时要刷新操作
    refreshHeight: function () {
      this._initWrapperSize();
      if (this.scroll && this.scroll.refresh) this.scroll.refresh();
      this._initScroll();
    },

    initialize: function ($super, opts) {
      $super(opts);
    },

    _initScroll: function () {
      if (this.scroll && this.scroll.destory) this.scroll.destory();
      if (this.sheight >= this.maxHeight) {
        this.scrollOpts.wrapper = this.swrapper;
        this.scrollOpts.scroller = this.html;
        this.scroll = new UIScroll(this.scrollOpts);
      }
    },

    reposition: function () {
      this.$root.css({
        'position': 'fixed',
        'left': '50%',
        'top': '50%',
        'margin-left': -(this.$root.width() / 2) + 'px',
        'margin-top': -(this.$root.height() / 2) + 'px'
      });
    },

    addEvent: function ($super) {
      $super();
      this.on('onShow', function () {
        this.initSize();
        this._initScroll();
        this.handleShadowContainer();
      }, 1);

      this.on('onHide', function () {
        if (this.scroll) {
          this.scroll.destroy();
          this.scroll = null;
        }
      });

    }

  });


});
