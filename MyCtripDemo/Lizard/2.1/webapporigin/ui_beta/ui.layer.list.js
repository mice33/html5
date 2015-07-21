
define(['UILayer', getAppUITemplatePath('ui.layer.list')], function (UILayer, template) {
  return _.inherit(UILayer, {
    propertys: function ($super) {
      $super();
      //html模板
      this.template = template;

      this.datamodel = {
        list: [],
        cancelText: '取消',
        className: 'popup-operate',
        index: -1
      };

      this.addEvents({
        'click .js_cancel': 'cancelAction',
        'click .js_item': 'itemAction'
      });

      this.onItemAction = function (data, index, e) {
      };
      this.animateInClass = 'cm-down-in';
      this.animateOutClass = 'cm-down-out';
    },
 
    setIndex: function (i) {
      if (i < 0 || i > this.datamodel.list.length) return;
      this.datamodel.index = i;
      this.$('li').removeClass('active');
      this.$('li[data-index="' + i + '"]').addClass("active");
    },

    cancelAction: function (e) {
      this.hide();
    },

    itemAction: function (e) {
      var el = $(e.currentTarget);
      var index = el.attr('data-index');
      var data = this.datamodel.list[index];
      this.setIndex(index);
      this.onItemAction.call(this, data, index, e);

    },

    //弹出层类垂直居中使用
    reposition: function () {
      this.$root.css({
        'position': 'fixed',
        'padding': '10px 0',
        'left': '10px',
        'right': '10px',
        'bottom': '0'
      });
    }

  });

});
