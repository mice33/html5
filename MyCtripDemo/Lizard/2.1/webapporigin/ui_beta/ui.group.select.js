/*
对select组件的使用，当前最复杂的组件
<section class="cm-modal ">
  <%if(typeof title == 'string' && title.length > 0){ %>
  <header class="cm-modal-hd js_header">
    <h3 class="cm-modal-title js_title">
      <%=title %></h3>
    <i class="icon-close js_close"></i>
  </header>
  <%} %>
  <div class="cm-modal-bd plr10 " >
     <div class="js_wrapper cm-scroll-select-group cm-scroll-select-group--birthday">
        <h3><%=title %></h3>
    </div>    
  </div>
  <footer class="cm-modal-ft cm-actions js_footer">
    <%if(typeof btns == 'string'){ %>
      <%=btns %>
    <% } else { %>
    <% for(var i = 0, len = btns.length; i < len; i++ ) {%>
    <span class="cm-actions-btn <%=btns[i].className%>">
      <%=btns[i].name%></span>
    <% } %>
    <%} %>
  </footer>
</section>
*/
define(['UILayer', getAppUITemplatePath('ui.group.select'), 'UISelect', getAppUICssPath('ui.group.select')], function (UILayer, template, UISelect, style) {


  return _.inherit(UILayer, {
    propertys: function ($super) {
      $super();
      //html模板
      this.template = template;

      this.addUIStyle(style);

      this.scrollCreated = false;

      this.datamodel = {
        title: '',
        tips: '',
        btns: [
          { name: '取消', className: 'cui-btns-cancel' },
          { name: '确定', className: 'cui-btns-ok' }
        ]
      };

      this.data = [];
      this.indexArr = [0, 0, 0];
      this.idArr = [];
      this.scrollArr = [];
      this.changedArr = [
        function (item) {
        },
        function (item) {
        },
        function (item) {
        }
      ];

      this.onOkAction = function (items) {

      };

      this.onCancelAction = function (items) {
        this.hide();
      };

      //这里便只有一个接口了
      this.displayNum = 5;

      this.addEvents({
        'click .cui-btns-ok': 'okAction',
        'click .cui-btns-cancel': 'cancelAction'
      });

    },

    okAction: function (e) {
      var items = [];
      for (i = 0, len = this.scrollArr.length; i < len; i++) {
        items.push(this.scrollArr[i].getSelected());
      }
      this.onOkAction.call(this, items);
    },

    cancelAction: function (e) {
      var items = [];
      for (i = 0, len = this.scrollArr.length; i < len; i++) {
        items.push(this.scrollArr[i].getSelected());
      }
      this.onCancelAction.call(this, items);
    },

    initElement: function () {
      this.scrollWrapper = this.$('.js_wrapper');
      this.tips = this.$('.js_tips');
    },


    _initScroll: function () {
      if (this.scrollCreated) return;
      this.scrollCreated = true;
      //      this._destroyScroll();
      var i, len, item, changeAction;
      for (i = 0, len = this.data.length; i < len; i++) {
        item = this.data[i];
        changeAction = this.changedArr[i] || function () { };
        this.scrollArr[i] = new UISelect({
          datamodel: {
            data: item,
            index: this.indexArr[i],
            id: this.idArr[i]
          },
          onCreate: function () {
            this.$root.addClass('cm-scroll-select-wrap');
          },
          displayNum: this.displayNum,
          changed: $.proxy(changeAction, this),
          wrapper: this.scrollWrapper
        });

        //纯粹业务需求
        if (i == 0 && len == 3) {
          this.scrollArr[i].on('onShow', function () {
            //            this.$el.addClass('cm-scroll-select-wrap');
          });
        }

        this.scrollArr[i].show();
      }
    },

    //缺少接口
    setTips: function (msg) {
      this.datamodel.tips = msg;
      this.tips.html(msg);
    },

    _destroyScroll: function () {
      var i, len;
      for (i = 0, len = this.data.length; i < len; i++) {
        if (this.scrollArr[i]) {
          this.scrollArr[i].destroy();
          this.scrollArr[i] = null;
        }
      }
      this.scrollCreated = false;
    },

    initialize: function ($super, opts) {
      $super(opts);
    },

    addEvent: function ($super) {
      $super();

      //这个要在第一位，因为后面会执行父类的position方法居中，尺寸没有就不行
      this.on('onShow', function () {
        this._initScroll();

      }, 1);

      this.on('onHide', function () {
        //        this._destroyScroll();

      }, 1);

    }

  });

});
