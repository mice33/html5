/*
getFilterList这块需要重新处理，不然事件会丢失
*/
define(['UIView', getAppUITemplatePath('ui.group.list'), getAppUICssPath('ui.group.list')], function (UIView, template, style) {


  return _.inherit(UIView, {
    propertys: function ($super) {
      $super();
      this.template = template;
      this.addUIStyle(style);

      this.datamodel = {
        data: [],
        filter: 'name'
      };

      this.addEvents({
        'click .js_group': 'groupAction',
        'click .js_items>li': 'itemAction'
      });

      this.onGroupClick = function (index, items, e) {
      };

      this.onItemClick = function (item, groupIndex, index, e) {
        console.log(arguments);
      };
    },

    itemAction: function (e) {
      var el = $(e.currentTarget);
      var gindex = el.attr('data-group');
      var index = el.attr('data-index');
      var item = this.datamodel.data[gindex].data[index];

      if (this.onItemClick) this.onItemClick.call(this, item, gindex, index, e);
    },

    groupAction: function (e) {
      var el = $(e.currentTarget).parent();
      var index = el.attr('data-groupindex');
      var items = this.datamodel.data[index];

      if (el.hasClass('expanded')) {
        el.removeClass('expanded');
      } else {
        el.addClass('expanded');
      }

      if (this.onGroupClick) this.onGroupClick.call(this, index, items, e);
    },

    getFilterList: function (key) {
      var list = this.$('li[data-filter*="' + key + '"]');
      return list.clone(); ;
    },

    initElement: function () {
      this.groups = this.$('.js_group');
    },

    initialize: function ($super, opts) {
      $super(opts);
    }

  });

});
